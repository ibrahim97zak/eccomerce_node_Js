import brandModel from "../../../../DB/model/Brand.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from 'slugify'
import { asyncHandler } from "../../../Services/errorHandling.js";
import subcategoryModel from "../../../../DB/model/SubCategory.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import { pagination } from "../../../Services/pagination.js";

export const createProduct = asyncHandler(async (req, res, next) => {
    const { name, price, discount, subCategoryId, categoryId, brandId } = req.body;
    const checkCategorie = await subcategoryModel.findOne({ _id: subCategoryId, categoryId })
    if (!checkCategorie) {
        return next(new Error('invalid category or subcategory', { cause: 400 }))
    }
    const checkBrand = await brandModel.findOne({ _id: brandId })
    if (!checkBrand) {
        return next(new Error('invalid brand', { cause: 400 }))
    }
    req.body.slug = slugify(name);
    req.body.finalPrice = price - (price * ((discount || 0) / 100))
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.APP_NAME}/product` })
    req.body.mainImage = { public_id, secure_url }
    if (req.files.subImages) {
        req.body.subImages = []
        for (const file of req.files.subImages) {
            const { public_id, secure_url } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/product/subImages` })
            req.body.subImages.push(public_id, secure_url)
        }
    }
    req.body.createdBy = req.user._id
    req.body.updatedBy = req.user._id
    const product = await productModel.create(req.body)
    if (!product) {
        return next(new Error('fail to create product', { cause: 400 }))
    }

    return res.json({ message: 'success', product })

})

export const updateProduct = asyncHandler(async (req, res, next) => {
    let { productId } = req.params
    let newProduct = await productModel.findById(productId)
    if (!newProduct) {
        return next(new Error(`no such product`, { cause: 404 }))
    }
    const { name, price, discount, subCategoryId, categoryId, brandId } = req.body;
    if (categoryId && subCategoryId) {
        const checkSubCategorie = await subcategoryModel.findOne({ _id: subCategoryId, categoryId })
        if (checkSubCategorie) {
            newProduct.subCategoryId = subCategoryId
            newProduct.categoryId = categoryId
        } else {
            return next(new Error(' category id or subcategory id not found', { cause: 400 }))
        }
    } else if (subCategoryId) {
        const checkSubCategorie = await subcategoryModel.findOne({ _id: subCategoryId })
        if (checkSubCategorie) {
            newProduct.subCategoryId = subCategoryId
        } else {
            return next(new Error('subcategory id is invalid ', { cause: 400 }))
        }
    }
    if (brandId) {
        const checkBrand = await brandModel.findOne({ _id: brandId });
        if (!checkBrand) {
            return next(new Error("invalid brand", { cause: 400 }));
        } else {
            newProduct.brandId = brandId
        }
    }
    if (name) {
        newProduct.name = name
        newProduct.slug = slugify(name)
    }
    if (req.body.description) {
        newProduct.description = req.body.description
    }
    if (req.body.stock) {
        newProduct.stock = req.body.stock
    }
    if (req.body.colors) {
        newProduct.colors = req.body.colors
    }
    if (req.body.sizes) {
        newProduct.sizes = req.body.sizes
    }
    if (price && discount) {
        newProduct.price = price
        newProduct.discount = discount
        newProduct.finalPrice = price - (price * ((discount || 0) / 100))
    } else if (price) {
        newProduct.price = price;
        newProduct.finalPrice = price - (price * ((newProduct.discount) / 100))

    } else if (discount) {
        newProduct.discount = discount;
        newProduct.finalPrice = newProduct.price - (newProduct.price * ((discount) / 100))

    }
    if (req.files.mainImage.length) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.APP_NAME}/product` })
        await cloudinary.uploader.destroy(newProduct.mainImage.public_id)
        newProduct.mainImage.secure_url = secure_url
        newProduct.mainImage.public_id = public_id
    }
    if (req.files.subImages.length) {
        const subImages = []
        for (const file of req.files.subImages) {
            const { public_id, secure_url } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/product` })
            await cloudinary.uploader.destroy(newProduct.mainImage.public_id)
            subImages.push({ secure_url, public_id })
        }
        newProduct.subImages = subImages
    }
    newProduct.updatedBy = req.user._id
    const product = await newProduct.save()
    if (!product) {
        return next(new Error('fail to update product', { cause: 400 }))
    }

    return res.json({ message: 'success', product })

})

export const softDelete = asyncHandler(async (req, res, next) => {
    const { productId } = req.params
    const product = await productModel.findByIdAndUpdate({ _id: productId, isDeleted: false }, { isDeleted: true }, { new: true })
    if (!product) {
        return next(new Error('invalid product', { cause: 400 }))
    }
    return res.status(200).json({ message: 'success', product })
})
export const restore = asyncHandler(async (req, res, next) => {
    const { productId } = req.params
    const product = await productModel.findByIdAndUpdate({ _id: productId, isDeleted: true }, { isDeleted: false }, { new: true })
    if (!product) {
        return next(new Error('invalid product', { cause: 400 }))
    }
    return res.status(200).json({ message: 'success', product })
})
export const forceDelete = asyncHandler(async (req, res, next) => {
    const { productId } = req.params
    const product = await productModel.findByIdAndDelete({ _id: productId, isDeleted: true })
    if (!product) {
        return next(new Error('invalid product', { cause: 400 }))
    }
    return res.status(200).json({ message: 'success', product })
})

export const softDeletedProducts = asyncHandler(async (req, res, next) => {
    const product = await productModel.find({ isDeleted: true })
    if (!product) {
        return next(new Error('invalid product', { cause: 400 }))
    }
    return res.status(200).json({ message: 'success', product })
})
export const getProduct = asyncHandler(async (req, res, next) => {
    const {productId} = req.params
    const product = await productModel.findById(productId).populate('review')
    if (!product) {
        return next(new Error('invalid product', { cause: 400 }))
    }
    return res.status(200).json({ message: 'success', product })
})
export const getProducts = asyncHandler(async (req, res, next) => {
    const{page,size}=req.query
    const {skip,limit}=pagination(page)
    const excludeQuery=['page','size','search','sort']
    const filterQuery={...req.query}
    excludeQuery.map(params =>{
        delete filterQuery[params]
    })
    const query=JSON.parse(JSON.stringify(filterQuery).replace(/(gt|gte|lt|lte|in|nin|eq|neq)/g, match=>`$${match}`))
    const mongoQuery =productModel.find(query).limit(size).skip(skip).
    sort(req.query.sort?.replaceAll(',', ' '))
    if(req.body.search){
        const products = await mongoQuery.find({
        name:{$regex:req.query.search,$options:'i'},
        description:{$regex:req.query.search,$options:'i'}
    })
    req.body.products=products
    }else{
        const products=await mongoQuery
        req.body.products=products
    }
    const products= req.body.products
    if (!products) {
        return next(new Error('invalid products', { cause: 400 }))
    }
    return res.status(200).json({ message: 'success', products })
})
