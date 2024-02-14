import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as CategoryController from './controller/Category.controller.js'
import subCategory from '../SubCategory/SubCategory.router.js'
import * as validators from "./Category.validation.js"
import validation from "../../Middleware/validation.js"
import { auth, roles } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Category.endpoint.js";
const router = Router();
router.use('/:categoryId/subCategory',subCategory)
// router.use('/')
router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).single('image'),validation(validators.createCategory),CategoryController.createCategory)
router.put('/update/:categoryId',auth(endPoint.update),fileUpload(fileValidation.image).single('image'),validation(validators.updateCategory),CategoryController.updateCategory)
router.get('/:categoryId',auth(endPoint.get),validation(validators.getCategory),CategoryController.getCategory)
router.get('/',auth(endPoint.get),CategoryController.getCategories)
export default router;