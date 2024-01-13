import { Router } from "express";
import * as reviewController from './controller/Review.controller.js'
import { auth, roles } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Review.endpoint.js";
const router = Router({mergeParams:true});

router.post('/',auth(endPoint.create),reviewController.createReview)
router.put('/',auth(endPoint.update),reviewController.updateReview)
export default router;