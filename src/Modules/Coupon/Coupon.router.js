import { Router } from "express";
import * as CouponController from './controller/Coupon.controller.js'
import * as validators from "./Coupon.validation.js"
import validation from "../../Middleware/validation.js"
import { auth, roles } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Coupon.endpoint.js";
const router = Router();

router.post('/',auth(endPoint.create),validation(validators.createCoupon),CouponController.createCoupon)
router.put('/update/:couponId',validation(validators.updateCoupon),CouponController.updateCoupon)
router.get('/:couponId',validation(validators.getCoupon),CouponController.getSpacificCoupon)
router.get('/',CouponController.getAllCoupons)

export default router;