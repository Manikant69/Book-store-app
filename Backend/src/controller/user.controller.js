import User from "../model/user.model.js";
import Book from "../model/book.model.js";
import Genre from "../model/genre.model.js";
import Order from "../model/order.model.js";
import { PAGINATION_LIMITS } from "../utils/constants.js";
import bcrypt from 'bcryptjs';

export const signup = async(req, res)=>{
    try {
        const {fullname, email, password} = req.body;
        
        if(!fullname && !email && !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user =await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const createdUser = new User({
            fullname: fullname,
            email: email,
            password: hashPassword,
        })

        await createdUser.save();
        res.status(201).json({message:"User created Successfully", user:{
            _id:createdUser._id,
            fullname:createdUser.fullname,
            email:createdUser.email
        }});

    } catch (error) {
        console.log("Erro: ", error);

        res.status(500).json({message:"Internal server error"});
    }
}


export const login =async (req, res)=>{

    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }


        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid password"});
        }

        res.status(200).json({message:"Login successful", user:{
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            role:user.role
        }})

    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export const getUserProfile = async(req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            user
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching user profile"
        });
    }
}

export const updateUserProfile = async(req, res) => {
    try {
        const { userId } = req.params;
        const { fullname, email } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Email already in use"
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                fullname: fullname || user.fullname,
                email: email || user.email
            },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while updating user profile"
        });
    }
}

export const changePassword = async(req, res) => {
    try {
        const { userId } = req.params;
        const { oldPassword, newPassword } = req.body;

        if (!userId || !oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while changing password"
        });
    }
}

// Admin: Get all users
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = PAGINATION_LIMITS.BOOKS_PER_PAGE, role, search } = req.query;
        let query = {};

        // Filter by role if specified
        if (role) {
            query.role = role;
        }

        // Search functionality
        if (search) {
            query.$or = [
                { fullname: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (page - 1) * limit;
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message
        });
    }
};

// Admin: Update user role
export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Must be 'admin' or 'user'"
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user
        });
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({
            success: false,
            message: "Error updating user role",
            error: error.message
        });
    }
};

// Admin: Delete user
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: error.message
        });
    }
};

// Admin: Get dashboard stats
export const getAdminStats = async (req, res) => {
    try {
        // Get counts
        const usersCount = await User.countDocuments();
        const booksCount = await Book.countDocuments();
        const ordersCount = await Order.countDocuments();
        const genresCount = await Genre.countDocuments();
        
        // Calculate total revenue
        const revenueResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalAmount" }
                }
            }
        ]);
        const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
        
        // Get recent orders
        const recentOrders = await Order.find()
            .populate('userId', 'fullname email')
            .sort({ createdAt: -1 })
            .limit(5)
            .select('_id userName totalAmount status createdAt');

        // Get additional stats for trends
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        // Weekly stats for trends
        const weeklyUsers = await User.countDocuments({ createdAt: { $gte: lastWeek } });
        const weeklyOrders = await Order.countDocuments({ createdAt: { $gte: lastWeek } });
        const weeklyBooks = await Book.countDocuments({ createdAt: { $gte: lastWeek } });
        
        const weeklyRevenue = await Order.aggregate([
            {
                $match: { createdAt: { $gte: lastWeek } }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalAmount" }
                }
            }
        ]);
        
        const weeklyRevenueAmount = weeklyRevenue.length > 0 ? weeklyRevenue[0].total : 0;
        
        // Calculate percentage changes (comparing with previous week)
        const previousWeekStart = new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
        const previousWeekUsers = await User.countDocuments({ 
            createdAt: { $gte: previousWeekStart, $lt: lastWeek } 
        });
        const previousWeekOrders = await Order.countDocuments({ 
            createdAt: { $gte: previousWeekStart, $lt: lastWeek } 
        });
        
        const usersTrend = previousWeekUsers > 0 ? 
            Math.round(((weeklyUsers - previousWeekUsers) / previousWeekUsers) * 100) : 100;
        const ordersTrend = previousWeekOrders > 0 ? 
            Math.round(((weeklyOrders - previousWeekOrders) / previousWeekOrders) * 100) : 100;
        
        res.status(200).json({
            success: true,
            message: "Admin stats fetched successfully",
            stats: {
                users: usersCount,
                books: booksCount,
                orders: ordersCount,
                genres: genresCount,
                revenue: revenue,
                recentOrders: recentOrders,
                trends: {
                    users: usersTrend >= 0 ? `+${usersTrend}%` : `${usersTrend}%`,
                    orders: ordersTrend >= 0 ? `+${ordersTrend}%` : `${ordersTrend}%`,
                    books: weeklyBooks > 0 ? `+${weeklyBooks}` : '0',
                    revenue: weeklyRevenueAmount > 0 ? `+$${weeklyRevenueAmount.toFixed(0)}` : '$0'
                }
            }
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching admin stats",
            error: error.message
        });
    }
};