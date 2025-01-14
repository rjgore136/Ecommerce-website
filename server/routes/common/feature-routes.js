import express from "express";
import {
  addFeatureImage,
  deleteFeatureImg,
  getFeatureImages,
} from "../../controllers/common/featureController.js";

const router = express.Router();

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImages);
router.delete("/:imgId", deleteFeatureImg);

export default router;
