// IMPORT DEPENDENCIES
import express from "express";
import path from "path";
import url from "url";
import cors from "cors";

// IMPORT DATABASE
import connectDatabase from "./config/db.js";
import createFolders from "./config/createFolders.js";

// IMPORT MIDDLEWARES
import { errorHandler, notFound } from "./middlewares/error.js";

// IMPORT ROUTES
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import productRouter from "./routes/product.js";
import cartRouter from "./routes/cart.js";
import orderRouter from "./routes/order.js";
import promoCodeRouter from "./routes/promoCode.js";
import affiliateRouter from "./routes/affiliate.js";

// INITIALIZE APP
const app = express();
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// STATIC FILE MIDDLEWARE
app.use("/public", express.static(path.join(__dirname, "public")));

// ROUTES
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/carts", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/affiliates", affiliateRouter);
app.use("/api/v1/promo-code", promoCodeRouter);

// CONNECT TO DATABASE
await connectDatabase;

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

// LISTEN ON PORT 8081
app.listen(process.env.PORT, () => {
  console.log("Server running on port 8081");
});
