import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';


dotenv.config(); // load environment variables from .env file


import userRouter from "./routes/userRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import productRouter from "./routes/productRouter.js";


const app = express(); // create an Express app

app.use(bodyParser.json()); // parse JSON request bodies

app.use((req, res, next) => {   // middleware function to verify token 
    let token = req.headers["authorization"]; 
    if(token!=null){
        token = token.replace("Bearer ", "");
        jwt.verify(token, process.env.JWT_Secret, (err, decoded) => {
            if(!err){
                req.user = decoded;        
            }
            else{
                res.status(401).json({
                    error : "Invalid token"
                })
            }
        })
    }
    next();
})


let mongoUrl= process.env.MONGO_URL; // get the MongoDB connection string

mongoose.connect(mongoUrl) // connect to MongoDB
let connection = mongoose.connection;  // get the connection object
connection.once("open", () => {
    console.log("Database connection established successfully");
})


// routes 
app.use("/api/users",userRouter)
app.use("/api/reviews",reviewRouter)
app.use("/api/products",productRouter)


// start the server 
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});


