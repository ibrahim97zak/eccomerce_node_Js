
import Joi from 'joi'
import { Types } from 'mongoose'


const validationObjectId =(value,helper)=>{

    if(Types.ObjectId.isValid(value)){
        return true 
    }else {

        return helper.message("id is not valid")

    }
}

export const generalFeilds = {

    email:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password:Joi.string().min(3).required(),
    file:Joi.object({
        fieldname:Joi.string().required(),
        originalname:Joi.string().required(),
        encoding:Joi.string().required(),
        mimetype:Joi.string().required(),
        destination:Joi.string().required(),
        filename:Joi.string().required(),
        path:Joi.string().required(),
        size:Joi.number().positive().required(),
        dest:Joi.string(),
    }),
    id:Joi.string().custom(validationObjectId).required(),
}

const validation = (schema)=>{
    return (req,res,next)=>{
        const inputData = {...req.body,...req.params,...req.query}
        if(req.file){
            inputData.file=req.file
        }
        const validationResult =schema.validate(inputData,{abortEarly:false})

        if(validationResult.error?.details){
            return res.json({message:"valiation error",validationError:validationResult.error?.details});
        }return next();
        
}
}

export default validation;