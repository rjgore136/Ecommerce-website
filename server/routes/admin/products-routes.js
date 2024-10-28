import express from "express";
import { upload } from "../../helpers/cloudinary.js";
import {
  addProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
  handleImageUpload,
} from "../../controllers/admin/productsController.js";

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);

export default router;

// https://res.cloudinary.com/dsxgkkebd/image/upload/v1729836025/rhmnyt6pnyqq0uzmahzm.png
