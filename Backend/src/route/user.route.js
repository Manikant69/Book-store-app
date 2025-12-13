import express from "express";
import { signup, login, getUserProfile, updateUserProfile, changePassword, getAllUsers, updateUserRole, deleteUser, getAdminStats } from "../controller/user.controller.js";
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile/:userId', getUserProfile);
router.put('/profile/:userId', updateUserProfile);
router.put('/change-password/:userId', changePassword);

// Admin routes
router.get('/admin/all', getAllUsers);
router.get('/admin/stats', getAdminStats);
router.put('/admin/:userId/role', updateUserRole);
router.delete('/admin/:userId', deleteUser);

export default router;