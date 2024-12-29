import express from "express";
import {
  capturePayment,
  createOrder,
  getAllOrdersByUserId,
  getOrderDetailsByOrderId,
} from "../../controllers/shop/order-controller.js";

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.post("/list-orders/:userId", getAllOrdersByUserId);
router.post("/order-details/:orderId", getOrderDetailsByOrderId);

export default router;
