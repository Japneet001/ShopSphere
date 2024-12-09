import express from "express";
import adminAuth from "../middlewares/adminAuth.js";
import {
    allOrders,
    placeOrderCOD,
    placeOrderRazorpay,
    placeOrderStripe,
    updateStatus,
    userOrders,
    verifyStripe,
} from "../controllers/orderController.js";
import authUser from "../middlewares/auth.js";

const orderRouter = express.Router();

// Admin Features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// Payment Features
orderRouter.post("/place", authUser, placeOrderCOD);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

// User Features
orderRouter.post("/userorders", authUser, userOrders);

// verify Payment
orderRouter.post('/verifyStripe',authUser,verifyStripe)

export default orderRouter;
