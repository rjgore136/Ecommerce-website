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
router.get("/list-orders/:userId", getAllOrdersByUserId);
router.get("/order-details/:orderId", getOrderDetailsByOrderId);

export default router;
