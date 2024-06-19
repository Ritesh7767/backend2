import app from "./app";
import connectDB from "./connectDB/connectDB";
import dotenv from 'dotenv'

dotenv.config()

connectDB()
.then(()=>app.listen(process.env.PORT || 8080, ()=> console.log("Server started at Port", process.env.PORT || 8080)))
.catch(()=>console.log("Failed connecting database"))