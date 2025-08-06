import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function registerUser(req, res) {

    const data = req.body;
    data.password = bcrypt.hashSync(data.password, 10);

    const newUser = new User(data);

    newUser.save()
        .then((user) => {
            res.status(201).json({
                message: "User registered successfully"
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({
                error : "Failed to register user"
               
                
            });
        });
}


export function loginUser(req,res){
    const data = req.body;

    User.findOne({
        email : data.email
    }).then(
        (user) => {
            if(user == null){
                return res.status(404).json({
                    error : "User not found"
                })
            }
            else{ 
                 const isPasswordValid = bcrypt.compareSync(data.password,user.password);
                    if(isPasswordValid){
                        const token = jwt.sign({
                            fristName : user.fristName,
                            lastName : user.lastName,
                            email : user.email,
                            role : user.role
                        },process.env.JWT_Secret)
                        res.json({
                            message : "User logged in successfully",
                            token : token
                        })
                    } 
                    else{
                        res.status(401).json({
                            error : "Invalid password"
                        })
                    }              
            }
        }
    )

}