import cartModel from "../../../../DB/model/Cart.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from 'slugify'
import { asyncHandler } from "../../../Services/errorHandling.js";
import productModel from "../../../../DB/model/Product.model.js";

export const addProductToCart =asyncHandler( async(req,res,next) => {
    const {productId,qty} = req.body;
    const product = await productModel.findById(productId)
    if(!product){
        return next(new Error("Product not found",{cause:400}))
    }
    if(product.stock < qty){
        return  next ( new Error ("invalid product quantity",{cause:400}))
    }
    const cart = await cartModel.findOne({userId:req.user.id})
    if(!cart){
        const newcart= await cartModel.create({
            userId   : req.user._id,
            products:[{productId,qty}]
        })
        return res.status(201).json({message:"success",newcart})
    }
    let matchProduct = false
    for(let i=0; i<cart.products.length; i++){
        if(cart.products[i].productId.toString() ===productId){
            cart.products[i].qty=qty
            break;
        }
    }
    if(!matchProduct){
        cart.products.push ({ productId , qty});

    }
    await cart.save();
    return res.status(200).json({message:"success"})


})
export const deleteProductFromCart=async(req,res,next)=>{
    const {productId}=req.body;
    const item=await cartModel.updateOne({userId:req.user._id},{
        $pull:
        {
            products:{
                productId:{$in:productId}
            }
        }
    })
    return res.json({message:"success"})
}

export const clearCart=async(req,res,next)=>{
    const clearCart=await cartModel.updateOne({userId:req.user._id},{
        products:[]
    })
    return res.json({message:"success"})
}

export const getCart=async(req,res,next)=>{
    const Cart=await cartModel.findOne({userId:req.user._id})
    return res.json({message:"success",Cart})
}