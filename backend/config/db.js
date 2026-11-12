import mongoose from 'mongoose';
const connectDB = async () => {
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'NotesDB'
        })
        console.log(`MongoDB Connected: ${connection.connection.host}`);
        console.log(`Database: ${connection.connection.name}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;