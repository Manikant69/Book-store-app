import express from "express";
import { addToWishlist, getWishlist, removeFromWishlist, checkInWishlist } from "../controller/wishlist.controller.js";

const router = express.Router();

router.post("/add", addToWishlist);
router.get("/:userId", getWishlist);
router.delete("/:userId/:bookId", removeFromWishlist);
router.get("/:userId/:bookId/check", checkInWishlist);

export default router;
