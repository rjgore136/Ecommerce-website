import express from "express";
import {
  addReview,
  getAllReviews,
} from "../../controllers/shop/review-controller.js";

const router = express.Router();

router.post("/add", addReview);
router.get("/:productId", getAllReviews);

export default router;
