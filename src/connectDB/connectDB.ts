import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
        console.log("Database connection successful at host :- ", connectionInstance.connection.host)
    } catch (error) {
        console.log("Failed to connect database", error)
        process.exit(1)
    }
}

export default connectDB