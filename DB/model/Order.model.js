import mongoose, { Schema, Types, model } from 'mongoose';
const orderSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        default: 1,
    }, products: [{
        productId: { type: Types.ObjectId, ref: 'Products', required: true },
        qty: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        finalPrice: { type: Number, required: true },
       
    }],
    couponId: { type: Types.ObjectId, ref: 'Coupon' },
    subTotal:{type: Number, required: true },
    finalPrice: { type: Number, required: true },
    paymentType: {
        type: String,
        default: "cash",
        enum: ['cash', 'card'],
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'canceled','approved','onWay','delivered']
    },
    reasonsReject: { type: String},
    note:String,
    updatedBy:{
        type:Types.ObjectId,
        ref:"User",

    }

},
    {
        timestamps: true
    })

const orderModel = mongoose.models.order || model('Order', orderSchema);
export default orderModel;


