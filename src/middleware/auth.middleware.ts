import {Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import jwt, { verify } from 'jsonwebtoken'
import ApiError from "../utils/apiError";
import User from "../models/user.model";

interface jwtPayload {
    _id : string,
    username: string,
    email: string
}

const isAuth = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.headers.authorization?.split(" ")[1]
    
        if(!token) throw new ApiError(403, "Not authorized for this action")
        const verifyToken = jwt.verify(token, `${process.env.ACCESS_SECRET}`) as jwtPayload

        const user = await User.findById(verifyToken._id)
        if(!user) throw new ApiError(404, 'Invalid token')

        if(user.blacklistToken.includes(token)) throw new ApiError(402, 'Invalid token')
            
        req._id = user._id
        req.accessToken = token
        next()
        
    } catch (error) {
        throw new ApiError(403, "Invalid Token")
    }
})

export default isAuth