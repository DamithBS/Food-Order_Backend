import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";


import userRouter from "./routes/userRouter.js";


const app = express(); // create an Express app

app.use(bodyParser.json()); // parse JSON request bodies

app.use((req, res, next) => {   // middleware function to verify token 
    let token = req.headers("Authorization");
    if(token!=null){
        token = token.replace("Bearer ", "");
        jwt.verify(token, "fo-1234", (err, decoded) => {
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

let mongoUrl= "mongodb+srv://admin:1234@cluster0.0v4vf4o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoUrl) // connect to MongoDB
let connection = mongoose.connection;  // get the connection object
connection.once("open", () => {
    console.log("Database connection established successfully");
})



app.use("/api/users",userRouter)
 
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});


