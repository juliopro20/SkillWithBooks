import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'
import cors from 'cors'

import roleRoute from './routes/role.js'; 
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import bookRoute from './routes/book.js';
import { seedBookData } from './seed.js'; // Importing the seed function

import dotenv from 'dotenv';//used to load environment variables from a .env file, which those variables might be protected.
dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());// Middleware to parse JSON bodies
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:4200', // Adjust to your frontend URL
    credentials: true,
}));

app.use('/api/role', roleRoute);// Importing the role route
app.use('/api/auth', authRoute);// Importing the auth route
app.use('/api/user', userRoute);// Importing the user route
app.use('/api/book', bookRoute);// Importing the book route

//response handler middleware
app.use((obj, _req, res, _next) => {
    const statusCode = obj.status || 500;
    const message = obj.message || "Something went wrong!";
    return res.status(statusCode).json({
        success: [200, 201, 204].some(a => a===obj.status) ? true : false,
        status: statusCode,
        message: message,
        data: obj.data
    });
});

//connecting to the database
const conectMongoDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        
        await seedBookData();
        console.log("Connected to the database")
    }
    catch(error) {
        throw error
    }
}

app.listen(port, ()=>{
    conectMongoDB()
    console.log(`Server is running on http://localhost:${port}`);
})