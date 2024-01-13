import { Router } from "express";
import * as OrderController from './controller/Order.controller.js'
import * as validators from "./Order.validation.js"
import validation from "../../Middleware/validation.js"
import { auth, roles } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Order.endpoint.js";
const router = Router();
router.post('/',auth(endPoint.create),OrderController.createOrder)
router.post('/allItemFromCart',auth(endPoint.create),OrderController.createOrderWithallItemFromCart)
router.patch('/cancel/:orderId',auth(endPoint.update),OrderController.cancelOrder)
router.patch('/updateOrderStatus/:orderId',auth(endPoint.updateOrderStatus),OrderController.updateOrderStatus)

export default router;