import Review from "../models/review.js";

// add review
export function addReview(req,res){
    if(req.user==null){
        res.status(401).json({
            message : "Please Login and try again"
        })
        return;
    }

    const data = req.body;

    data.name = req.user.fristName + " " + req.user.lastName;
    data.profilePicture = req.user.profilePicture;
    data.email = req.user.email;

    const newReview = new Review(data);

    newReview.save().then((review) => {
        res.status(201).json({
            message : "Review added successfully"
        })
    }).catch((error) => {
        res.status(500).json({
            error : "Failed to add review"
        })
    })
}

// get all reviews
export function getReviews(req,res){
    const user = req.user;

    if(user==null || user.role !="admin"){
        Review.find({isApproved : true}).then((reviews) => {
            res.json(reviews);
        })
        return;
    }

    if(user.role == "admin"){
        Review.find().then((reviews) => {
            res.json(reviews);
        })
        return;
    }
}

// delete review
export function deleteReview(req,res){

    const email = req.params.email;

    if(req.user==null){
        res.status(401).json({
            message : "Please Login and try again"
        })
        return;
    }

    if(req.user.role == "admin"){
        Review.deleteOne({email : email}).then((review) => {
            res.json({
                message : "Review deleted successfully"
            })
        }).catch((error) => {
            res.status(500).json({
                error : "Failed to delete review"
            })
        })
        return;
    }

    if(req.user.role == "customer"){
        if(req.user.email == email){
            Review.deleteOne({email : email}).then((review) => {
                res.json({
                    message : "Review deleted successfully"
                })
            }).catch((error) => {
                res.status(500).json({
                    error : "Failed to delete review"
                })
            })
        }
        else{
            res.status(401).json({
                error : "You are not authorized to delete this review"
            })
        }
    }
}

// approve review
export function approveReview(req,res){
    const email = req.params.email;

    if(req.user == null){
        res.status(401).json({
            message : "Please Login and try again"
        })
        return;
    }

    if(req.user.role == "admin"){
        Review.updateOne({
            email : email,
        },{
            isApproved: true
        }).then(()=>{
            res.json({
                message : "Review approved successfully"
            })
        })
        .catch((error) => {
            res.status(500).json({
                error : "Failed to approve review"
            })
        })
    
    }
    else{
        res.status(401).json({
            error : "You are not authorized to approve this review"
        })
    }
}