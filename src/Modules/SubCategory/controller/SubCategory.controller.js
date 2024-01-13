import subcategoryModel from "../../../../DB/model/SubCategory.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from 'slugify'
import { asyncHandler } from "../../../Services/errorHandling.js";

export const createSubCategory = asyncHandler(async(req,res,next) => {

const {categoryId}= req.params
    const {name} = req.body;
    if(await subcategoryModel.findOne({name})){
        return next(new Error('Dublicate Sub category name',{cause:409}))
    }
    const{public_id,secure_url}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/subcategory`})
    const subcategory = await subcategoryModel.create({name,slug:slugify(name),categoryId,image:{public_id,secure_url},createdBy:req.user._id,updatedBy:req.user._id})
    return res.status(200).json({message:'success',subcategory})


})
export const updateSubCategory = asyncHandler( async(req,res,next)=>{
    const {categoryId,subCategoryId}=req.params
const subCategory=await subcategoryModel.findOne({_id:subCategoryId,categoryId})
if(!subCategory){
    return next ( new Error (`No such Category found ${req.params.subCategoryId}`,{cause:400}))
}
if(req.body.name){
    if(subCategory==req.body.name){
        return next(new Error('old name match new name',{cause:409}))
    }
    if(await subcategoryModel.findOne({name:req.body.name})){
        return next(new Error('Dublicate sub category name',{cause:409}))
    }
    subCategory.name=req.body.name;
    subCategory.slug=slugify(req.body.name)
}
if(req.file){
    const{public_id,secure_url}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/subcategory`})
    await cloudinary.uploader.destroy(subCategory.image.public_id)
    subCategory.image={public_id,secure_url}
}
req.body.updatedBy=req.user._id
await subCategory.save();
return res.json({message:'success',subCategory})
})
export const getspacificSubCategory = asyncHandler( async(req,res,next)=>{
    const {categoryId}=req.params
    const subcategory= await subcategoryModel.find({categoryId})
    return res.status(200).json({message:'success',subcategory})
    })
    export const getsubCategories = asyncHandler( async(req,res,next)=>{
        const subcategories= await subcategoryModel.find().populate({
            path:"categoryId",
            select:"name"
        })
        return res.status(200).json({message:'success',subcategories})
        })
export const getProducts = asyncHandler(async(req,res,next)=>{
    const {subCategoryId}=req.params
    const products = await subcategoryModel.findById(subCategoryId).populate({
        path : 'products',
        match:{isDeleted:{$eq:false}}
        
    })
    return res.json(products)
})
export const getProduct = asyncHandler(async(req,res,next)=>{
    const {subCategoryId,productId}=req.params
    const product = await subcategoryModel.findById(subCategoryId).populate({
        path : 'products',
        match:{_id:{$eq:productId}},
        populate:{path:'review'}
        
    })
return res.status(200).json(product?.products[0])
})


