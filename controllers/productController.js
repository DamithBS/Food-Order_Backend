import Product from "../models/product.js";
import { isItAdmin } from "./userController.js";

export async function addProduct(req,res){
    try{
        if(req.user == null){
            res.status(401).json({
                message : "Please Login and try again"
            })
            return;
        }
        if(req.user.role !== "admin"){
            res.status(401).json({
                message : "You are not authorized to add a product"
            })
            return;
        }

        const data = req.body;
        const newProduct = new Product(data);
        await newProduct.save();
        res.status(201).json({
            message : "Product added successfully"
        })
    }
    catch(e){
        res.status(500).json({
            message : "Failed to add product"
        })
    }
}

// get all products
export async function getProducts(req,res){
    
    try{
        if(isItAdmin(req)){
            const products = await Product.find({});
            res.json(products);
            return;
        }
        else{
            const products = await Product.find({availability : true});
            res.json(products);
            return;
        }
      
    }
    catch(e){
        res.status(500).json({
            message : "Failed to get products"
        })
    }
}



export async function updateProduct(req,res){
    try{
        if(isItAdmin(req)){
            const key =req.params.key;
            const data = req.body;
            await Product.updateOne({key : key},data);
            res.status(200).json({
                message : "Product updated successfully"
            })
            return;
        }
        else{
            res.status(401).json({
                message : "You are not authorized to update a product"
            })
        }
    }
    catch(e){
        res.status(500).json({
            message : "Failed to update product"
        })
    }
}


export async function deleteProduct(req,res){
    try{
        if(isItAdmin(req)){
            const key =req.params.key;
            await Product.deleteOne({key : key});
            res.status(200).json({
                message : "Product deleted successfully"
            })
            return;
        }
        else{
            res.status(401).json({
                message : "You are not authorized to delete a product"
            })
        }
    }
    catch(e){
        res.status(500).json({
            message : "Failed to delete product"
        })
    }
}