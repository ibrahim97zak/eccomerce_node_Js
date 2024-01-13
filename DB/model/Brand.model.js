
import mongoose, {Schema,Types,model} from 'mongoose';
const brandSchema= new Schema ({
    name:{
        type:String,
        required:true,
        unique:true
    },
    amount:{
        type:Number,
        default:1,
    }, image:{
        type:Object,
        required:true,
    },
    categoryId:{
        type:Types.ObjectId,
        ref:'Category',
        required:true,
    },
    createdBy:{
        type:Types.ObjectId,
        ref:"User",
        required:true,

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

const brandModel = mongoose.models.brand ||  model('Brand',brandSchema);
export default brandModel;


