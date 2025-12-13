import express from "express";
import { addToCart, getCart, removeFromCart, updateCartQuantity, clearCart } from "../controller/cart.controller.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/:userId", getCart);
router.delete("/:userId/:bookId", removeFromCart);
router.put("/:userId/:bookId", updateCartQuantity);
router.delete("/:userId/clear", clearCart);

export default router;
