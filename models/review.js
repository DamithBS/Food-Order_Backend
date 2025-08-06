import e from "express";
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        required : true
    },
    comment : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now,
        required : true
    },
    profilePicture : {
        type : String,
        required : true,
        default:"https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"
    },
    isApproved : {
        type : Boolean,
        default : false,
        required : true
    }
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;