import express from "express";
import { createOrder, getUserOrders, getOrderDetails, cancelOrder, updateOrderStatus, getAllOrders, updateOrderStatusAdmin } from "../controller/order.controller.js";

const router = express.Router();

// Admin routes (must come BEFORE parameterized routes)
router.get("/admin/all", getAllOrders);
router.put("/admin/:orderId/status", updateOrderStatusAdmin);

// Public routes
router.post("/create", createOrder);
router.get("/:userId", getUserOrders);
router.get("/:userId/:orderId", getOrderDetails);
router.delete("/:userId/:orderId/cancel", cancelOrder);
router.put("/:userId/:orderId/status", updateOrderStatus);

export default router;
