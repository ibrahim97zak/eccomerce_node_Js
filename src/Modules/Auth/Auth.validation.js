import Joi from 'joi'
import { generalFeilds } from '../../Middleware/validation.js';

export const signupSchema = 

   Joi.object({
        name:Joi.string().alphanum().min(3).max(20).required().messages({
            'any.required':'username is required',
            'string.empty':'username is required'
        }),
        email:generalFeilds.email,
        password:generalFeilds.password,
        cPassword:Joi.string().valid(Joi.ref('password')).required(),
    }).required()
export const token = 
Joi.object({
       token:Joi.string().required(), 
    }).required()


export const loginSchema =Joi.object({
        email:generalFeilds.email,
        password:generalFeilds.password,
    }).required()

export const sendCode =Joi.object({
        email:generalFeilds.email,
    }).required()

export const forgetPassword =Joi.object({
            email:generalFeilds.email,
            password:generalFeilds.password,
            cPassword:Joi.string().valid(Joi.ref('password')).required(),
            code:Joi.string().required(),
        }).required();
    
