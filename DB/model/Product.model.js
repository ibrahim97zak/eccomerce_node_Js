
import mongoose, {Schema,Types,model} from 'mongoose';
const productSchema= new Schema ({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    slug:{
        type: String,
        required:true,
    },
    description:String,
    stock:{
        type:Number,
        default:1,
    },
    price:{
        type:Number,
        default:1,
    },
    discount:{
        type:Number,
        default:0,
    },
    finalPrice:{
        type: Number,
        default:1,
    },
    colors:{
        type:[String],
    }
    ,sizes:[{
        type:String,
        enum:['s','m','lg','xl']
    }],
    mainImage:{
        type:Object,
        required:true,
    },
    subImages:{
        type:Object,
    },
    isDeleted:{
        type: Boolean,
        default :false,
    },
    categoryId:{
        type:Types.ObjectId,
        ref:'Category',
        required:true,
    },
    subCategoryId:{
        type:Types.ObjectId,
        ref:'Subcategory',
        required:true,
    },
    brandId:{
        type:Types.ObjectId,
        ref:'Brand',
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
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps:true
})
productSchema.virtual('review',{
    localField:'_id',
    foreignField:'productId',
    ref:"Review"
})

const productModel = mongoose.models.product ||  model('Product',productSchema);
export default productModel;


