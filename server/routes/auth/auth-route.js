import express from "express";
import { registerUser } from "../../controllers/auth/authController";

const authRouter = express.Router();

authRouter.post("/register", registerUser);

export default authRouter;
