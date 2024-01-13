import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";
export const createProduct = joi.object({
    name:joi.string().min(2).max(20).required(),
    file:generalFeilds.file.required(),
    categoryId:generalFeilds.id.required(),
}).required()

export const updateProduct = joi.object({
    brandId:generalFeilds.id,
    name:joi.string().min(2).max(20),
    file:generalFeilds.file,
}).required()

