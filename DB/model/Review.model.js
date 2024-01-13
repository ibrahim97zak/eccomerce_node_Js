
import mongoose, {Schema,Types,model} from 'mongoose';
const reviewSchema= new Schema ({
    comment:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true,
    },
    productId:{type:Types.ObjectId,ref:'Product',required:true},
    createdBy:{
        type:Types.ObjectId,
        ref:"User",
        required:true,
    },
    orderId:{type:Types.ObjectId,ref:"Order",required:true}
},
{
    timestamps:true
})

const reviewModel = mongoose.models.review ||  model('Review',reviewSchema);
export default reviewModel;


