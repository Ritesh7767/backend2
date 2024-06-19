import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface userSchemaInterface{
    _id: mongoose.Schema.Types.ObjectId,
    username: string,
    email: string,
    password: string,
    refreshToken: string
    blacklistToken: string[],
    isPasswordCorrect: (password: string)=>Promise<boolean>,
    generateAccessToken: ()=>string,
    generateRefreshToken: ()=>string
}

const userSchema = new mongoose.Schema<userSchemaInterface>({
    username: {
        type: String,
        required: true,
        // trim: true,
        lowercase: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        // trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        // trim: true
    },
    refreshToken: {
        types: String,
        // trim: true
    },
    blacklistToken: [
        {
            type: String,
            // trim: true
        }
    ]
})

userSchema.pre('save', async function(next){

    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 5)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password: string){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        },
        `${process.env.ACCESS_SECRET}`,
        {
            expiresIn : process.env.ACCESS_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        `${process.env.REFRESH_TOKEN}`,
        {
            expiresIn: process.env.REFRESH_EXPIRY
        }
    )
}

const User = mongoose.model<userSchemaInterface>("User", userSchema)

export default User