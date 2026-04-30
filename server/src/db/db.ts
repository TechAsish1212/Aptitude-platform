import mongoose from "mongoose";

const DB_NAME="Aptitude-platform";
const connectDB=async():Promise<void>=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\nDatabase connected successfully!! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Error connecting to DB",error.message);
        process.exit(1);
    }
}

export default connectDB;