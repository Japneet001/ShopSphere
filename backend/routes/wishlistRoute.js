import express from "express";
import {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
} from "../controllers/wishlistController.js";
import authUser from "../middlewares/auth.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/add", authUser, addToWishlist);
wishlistRouter.post("/get", authUser, getWishlist);
wishlistRouter.post("/remove", authUser, removeFromWishlist);

export default wishlistRouter;
