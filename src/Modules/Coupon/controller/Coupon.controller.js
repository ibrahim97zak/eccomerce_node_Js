import couponModel from "../../../../DB/model/Coupon.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from 'slugify'
import { asyncHandler } from "../../../Services/errorHandling.js";

export const createCoupon =async(req,res,next) => {
    const {name} = req.body;
    let date= new Date(req.body.expirdeDate)
    let now = new Date()
    if(now.getTime()>=date.getTime()){
        return next(new Error('invalid date',{cause:400}))
    }
    date=date.toLocaleDateString()
    req.body.expirdeDate= date
    if(await couponModel.findOne({name})){
        return next(new Error('Dublicate coupon name',{cause:409}))
    }
    req.body.createdBy=req.user._id
    req.body.updatedBy=req.user._id
    const coupon = await couponModel.create(req.body)
    return res.status(200).json({message:'success',coupon})
}
export const updateCoupon = asyncHandler( async(req,res,next)=>{
const coupon=await couponModel.findById(req.params.couponId)
if(!coupon){
    return next ( new Error (`No such Coupon found ${req.params.couponId}`,{cause:400}))
}
if(req.body.name){
    if(coupon==req.body.name){
        return next(new Error('old name match new name',{cause:409}))
    }
    if(await couponModel.findOne({name:req.body.name})){
        return next(new Error('Dublicate coupon name',{cause:409}))
    }
    coupon.name=req.body.name;
    coupon.amount=req.body.amount
}
    req.body.updatedBy=req.user._id
await coupon.save();
return res.json({message:'success',coupon})
})
export const getSpacificCoupon = asyncHandler( async(req,res,next)=>{
    const coupon= await couponModel.findById(req.params.couponId)
    if(!coupon){
        return  next( new Error('no Such category with id'))
    }
    return res.status(200).json({message:'success',coupon})
})
export const getAllCoupons = asyncHandler( async(req,res,next)=>{
        const categories= await couponModel.find()
        return res.status(200).json({message:'success',categories})
})