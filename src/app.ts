import express from 'express'
import cors from "cors"
import ApiError from './utils/apiError'

const app = express()

const whitelist = process.env.WHITELIST?.split(",")

const corOptions = {
    origin: function(origin: string, callback:(err: Error | null, allow?: boolean)=>void){
        if(whitelist?.includes(origin)) callback(null, true)
        else callback(new ApiError(401, 'Not allowed by cors policy'))
    }
}

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true}))

import userRouter from './routers/user.router'

app.use("api/v1/user", userRouter)

export default app

