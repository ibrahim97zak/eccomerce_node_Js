
import mongoose, {Schema,Types,model} from 'mongoose';
const couponSchema= new Schema ({
    name:{
        type:String,
        required:true,
        unique:true
    },
    amount:{
        type:Number,
        default:1,
    },
        expirdeDate:{type:String, required:true},
        usedBy:[{ type:Types.ObjectId,ref:'User'}],
    createdBy:{
        type:Types.ObjectId,
        ref:"User",
        required: true
    },
    updatedBy:{
        type:Types.ObjectId,
        ref:"User",
        required:true,
    }

},
{
    timestamps:true
})

const couponModel = mongoose.models.coupon ||  model('Coupon',couponSchema);
export default couponModel;


