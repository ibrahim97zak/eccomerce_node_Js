import brandModel from "../../../../DB/model/Brand.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from 'slugify'
import { asyncHandler } from "../../../Services/errorHandling.js";
import subcategoryModel from "../../../../DB/model/SubCategory.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import orderModel from "../../../../DB/model/Order.model.js";
import reviewModel from "../../../../DB/model/Review.model.js";

export const createReview = asyncHandler(async (req, res, next) => {
    const {productId}=req.params
    const {comment,rating}=req.body
    let order= await orderModel.findOne({
        userId: req.user._id,
        "products.productId":productId
        
    })
    if(!order){
        return  next ( new Error ('invalid product',{cause:400}))
    }
    if (order.status != 'delivered') {
        return  next ( new Error ('cant review befor reciving the product',{cause:400}))

    }
    const checkReview= await reviewModel.findOne({createdBy:req.user._id,productId})
    if(checkReview){
        return  next ( new Error ('you have already reviewed this product before',{cause:400}))
    }
    const review= await reviewModel.create({
        createdBy:req.user._id,
        orderId:order._id,
        productId,
        comment,
        rating

    })
    return res.status(201).json({message:'success',review})
   
   

})
export const updateReview = asyncHandler(async (req, res, next) => {
    const {productId,reviewId}=req.params
    const {comment,rating}=req.body
    const review= await reviewModel.findByIdAndUpdate({_id:reviewId,createdBy:req.user._id,productId},req.body,{new:true})
    return res.status(201).json({message:'success',review})
   
   
})