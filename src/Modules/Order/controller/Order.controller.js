import cartModel from "../../../../DB/model/Cart.model.js";
import couponModel from "../../../../DB/model/Coupon.model.js";
import orderModel from "../../../../DB/model/Order.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import  moment from 'moment';

export const createOrder =asyncHandler(async(req,res,next) => {
   const{products,address,phoneNumber,couponName,paymentType} = req.body;
   if(couponName){
    const coupon = await couponModel.findOne({name: couponName.toLowerCase()})
    if(!coupon){
        return  next ( new Error ("invalid coupon",{cause:400}))
    }
    let now = moment();
    let parsed = moment(coupon.expirdeDate, "MM-DD-YYYY")
    let diff = now.diff(parsed,'days')
    if(diff >=0){
        return  next ( new Error ('coupon is expired',{cause:400}))
    }
    if(coupon.usedBy.includes(req.user._id)){
        return  next ( new Error ('coupon already used',{cause:400}))
    }
    req.body.coupon=coupon
}
const finalProductList=[]
const productIds=[]
let subTotal=0
for(const product of products){
    const checkProduct = await productModel.findOne({
        _id:product.productId,
        stock:{$gte:product.qty},
        isDeleted:false,
    })
    if(!checkProduct){
        return  next ( new Error ('invalid product',{cause:400}))
    }
    product.unitPrice = checkProduct.finalPrice
    product.finalPrice=product.qty* checkProduct.finalPrice
    subTotal+=product.finalPrice
    productIds.push(product.productId)
    finalProductList.push(product)
}
const order= await orderModel.create({
    userId: req.user._id,
    address,
    phoneNumber,
    products:finalProductList,
    subTotal,
    couponId:req.body.coupon?._id,
    paymentType,
    finalPrice:subTotal-(subTotal*((req.body.coupon?.amount|0)/100)),
    status:(paymentType=='card')?'approved':'pending',
})

for(const product of products){
    await productModel.updateOne({_id:product.productId},{$inc:{stock:-product.qty}})
}
if(req.body.coupon){
    await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id,}})
}
await cartModel.updateOne({userId:req.user._id},{
    $pull:{
        products:{
            productId:{$in:productIds},
        }
    }
})
return res.status(201).json({message:'success',order})
}) 

export const createOrderWithallItemFromCart= asyncHandler( async(req,res,next)=>{
    const{products,address,phoneNumber,couponName,paymentType} = req.body;
const cart = await cartModel.findOne({userId:req.user._id})
if(cart?.products?.lenght){
    return  next ( new Error ('empty cart',{cause:400}))
}
req.body.products = cart.products
if(couponName){
    const coupon = await couponModel.findOne({name: couponName.toLowerCase()})
    if(!coupon){
        return  next ( new Error ("invalid coupon",{cause:400}))
    }
    let now = moment();
    let parsed = moment(coupon.expirdeDate, "MM-DD-YYYY")
    let diff = now.diff(parsed,'days')
    if(diff >=0){
        return  next ( new Error ('coupon is expired',{cause:400}))
    }
    if(coupon.usedBy.includes(req.user._id)){
        return  next ( new Error ('coupon already used',{cause:400}))
    }
    req.body.coupon=coupon
}
const finalProductList=[]
const productIds=[]
let subTotal=0
for(let product of req.body.products){
    const checkProduct = await productModel.findOne({
        _id:product.productId,
        stock:{$gte:product.qty},
        isDeleted:false,
    })
    if(!checkProduct){
        return  next ( new Error ('invalid product',{cause:400}))
    }
    product=product.toObject()
    product.unitPrice = checkProduct.finalPrice
    product.finalPrice=product.qty* checkProduct.finalPrice
    subTotal+=product.finalPrice
    productIds.push(product.productId)
    finalProductList.push(product)
}
const order= await orderModel.create({
    userId: req.user._id,
    address,
    phoneNumber,
    products:finalProductList,
    subTotal,
    couponId:req.body.coupon?._id,
    paymentType,
    finalPrice:subTotal-(subTotal*((req.body.coupon?.amount|0)/100)),
    status:(paymentType=='card')?'approved':'pending',
})

for(const product of req.body.products){
    await productModel.updateOne({_id:product.productId},{$inc:{stock:-product.qty}})
}
if(req.body.coupon){
    await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id,}})
}
await cartModel.updateOne({userId:req.user._id},{
    products:[]
})
return res.status(201).json({message:'success',order})

})
export const cancelOrder = asyncHandler(async(req,res,next) => {
    const {orderId} = req.params
    const {reasonsReject}=req.body
    const order = await orderModel.findOne({_id:orderId,userId:req.user._id})
    if(!order || order.status !='pending'||order.paymentType!='cash'){
        return  next ( new Error ("can't cancel this order",{cause:400}))
    }
    await orderModel.updateOne({_id:order._id},{status:'canceled',reasonsReject,updatedBy:req.user._id})
    for(const product of order.products){
        await productModel.updateOne({_id:product.productId},{
            $inc:{stock:product.qty}
        })
    }
    if(order.couponId){
        await couponModel.updateOne({_id:order.couponId},{
            $pull:{usedBy:req.user._id}
        })
    }
    return res.json({message:'success'})
})
export const updateOrderStatus = asyncHandler(async(req,res,next) => {
    const {orderId} = req.params
   const {status}=req.body
   const order = await orderModel.findById({_id:orderId})
   if(!order|| order.status=='delivered'){
    return  next ( new Error (`this order is not found or this order status is :${order.status}`,{cause:400}))
   }
   if(status==='canceled'){
    const {reasonsReject}=req.body
    if(!reasonsReject){
       return  next ( new Error ('please provide reasons to reject the order',{cause:400}))
    }
    const order = await orderModel.findOne({_id:orderId,userId:req.user._id})
    if(!order || order.status !='pending'||order.paymentType!='cash'){
        return  next ( new Error ("can't cancel this order",{cause:400}))
    }
    await orderModel.updateOne({_id:order._id},{status:'canceled',reasonsReject,updatedBy:req.user._id})
    for(const product of order.products){
        await productModel.updateOne({_id:product.productId},{
            $inc:{stock:product.qty}
        })
    }
    if(order.couponId){
        await couponModel.updateOne({_id:order.couponId},{
            $pull:{usedBy:req.user._id}
        })
    }
   }
   const changeOrderStatus = await orderModel.updateOne ({_id:orderId},{status,updatedBy:req.user._id})
   if(!changeOrderStatus.matchedCount){
    return  next ( new Error ('failed to change status',{cause:400}))
   }
   return res.json({message:"success"})
})