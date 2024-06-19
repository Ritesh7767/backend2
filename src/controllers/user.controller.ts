import { Router, Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import {userLoginValidation, userRegisterValidation} from "../zod/user.zod";
import User from "../models/user.model";
import ApiResponse from "../utils/apiResponse";

export const userRegister = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const {username, email, password} = req.body
    if([username, email, password].some(ele => ele.trim() == '')) throw new ApiError(400, 'Every mandatory field is required')
    
    const isDataCorrect = userRegisterValidation.safeParse(req.body)
    if(!isDataCorrect.success) throw new ApiError(400, 'Invalid data provided')

    const existingUser = await User.find({$or : [{username}, {email}]})
    if(existingUser) throw new ApiError(401, 'User already exist')
    
    const user = await User.create(req.body)

    const createdUser = await User.findById(user._id)
    if(!createdUser) throw new ApiError(500, 'Something went wrong while creating user')

    res.status(201).json(new ApiResponse(201, {createdUser}, "User created successfull"))
})

export const userLogin = asyncHandler(async(req: Request, res:Response, next: NextFunction) => {
    const {email, password} = req.body
    if([email, password].some(ele => ele.trim() === "")) throw new ApiError(402, 'Please provide every field')
    
    const isDataCorrect = userLoginValidation.safeParse(req.body)
    if(!isDataCorrect.success) throw new ApiError(401, 'Invalid data provided')
    
    const user = await User.findOne({email})
    if(!user) throw new ApiError(404, "User does not found")
    
    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if(!isPasswordCorrect) throw new ApiError(402, 'Incorrect emailId or password')

    const refreshToken = user.generateRefreshToken()
    const accessToken = user.generateAccessToken()

    user.refreshToken = refreshToken
    user.save()

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -blacklistToken")

    res.status(201).json(new ApiResponse(201, {loggedInUser, accessToken, refreshToken}, "User loggedIn successfully"))
})

export const userProfile = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    const user = await User.findById(req._id).select("-password -refreshToken -blacklistToken")
    if(!user) throw new ApiError(404, 'User does not exist')

    res.status(201).json(new ApiResponse(201, user))
})

export const userLoggout = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    const user = await User.findById(req._id)
    if(!user) throw new ApiError(404, "User does not exist")

    user.blacklistToken.push(req.accessToken)
    user.save()

    res.status(201).json(new ApiResponse(201, {}, "user logged out"))
})

export const userDelete = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    const {email, password} = req.body
    if([email, password].some(ele => ele.trim() == "")) throw new ApiError(401, "Every field is required")
    
    const isDataCorrect = userRegisterValidation.safeParse(req.body)
    if(!isDataCorrect.success) throw new ApiError(401, 'Invalid data provided')
    
    const user = await User.findOne({email})
    if(!user) throw new ApiError(404, "User does not exist")

    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if(!isPasswordCorrect) throw new ApiError(402, 'Email or password is incorrect')

    const deletedUser = await user.deleteOne()
    res.status(201).json(new ApiResponse(201, deletedUser, "User deleted successfully"))
})

