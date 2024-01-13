import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as SubCategoryController from './controller/SubCategory.controller.js'
import * as validators from "./SubCategory.validation.js"
import validation from "../../Middleware/validation.js"
import { auth, roles } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./SubCategory.endpoint.js";
const router = Router({mergeParams:true});

router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).single('image')
,validation(validators.createSubCategory),SubCategoryController.createSubCategory)
router.put('/update/:subCategoryId',fileUpload(fileValidation.image).single('image')
,validation(validators.updateSubCategory),SubCategoryController.updateSubCategory)
router.get('/',SubCategoryController.getspacificSubCategory)
router.get('/all',SubCategoryController.getsubCategories)
router.get('/:subCategoryId/products',SubCategoryController.getProducts)
router.get('/:subCategoryId/product/:productId',SubCategoryController.getProduct)
export default router;