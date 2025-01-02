import express from "express";
import {
  getAllOrders,
  getOrderDetailsForAdmin,
  upadateOrderStatus,
} from "../../controllers/admin/orderController.js";

const router = express.Router();

router.get("/get", getAllOrders);
router.get("/order-details/:orderId", getOrderDetailsForAdmin);
router.put("/update/:orderId", upadateOrderStatus);

export default router;
