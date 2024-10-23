import express from "express";
import { upload } from "../../helpers/cloudinary.js";
import { handleImageUpload } from "../../controllers/admin/productsController.js";

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);

export default router;
