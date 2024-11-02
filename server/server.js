import express from "express";
import dotenv from "dotenv";
import connectDB from "./DB/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth/auth-route.js";
import adminProductsRouter from "./routes/admin/products-routes.js";
import shoppingProductsRouter from "./routes/shop/product-routes.js";
import cartRouter from "./routes/shop/cart-routes.js";

dotenv.config();

const port = process.env.PORT || 3000;
const url = process.env.MONGO_URL;

const app = express();

//db connection
connectDB(url);

//middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products", shoppingProductsRouter);
app.use("/api/shop/cart", cartRouter);

app.listen(port, (req, res) => {
  console.log(`The server is running on http://localhost:${port}`);
});
