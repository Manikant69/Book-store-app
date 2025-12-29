import User from "../model/user.model.js";
import Book from "../model/book.model.js";
import Order from "../model/order.model.js";
import { PAGINATION_LIMITS } from "../utils/constants.js";

const createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount, shippingAddress, paymentMethod } = req.body;

        // Enhanced validation
        if (!userId || !items || items.length === 0 || !totalAmount) {
            return res.status(400).json({
                success: false,
                message: "All order details are required"
            });
        }

        // Validate MongoDB ObjectId format
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Create order items with book details
        const orderItems = [];
        for (const item of items) {
            const book = await Book.findById(item.bookId);
            if (book) {
                orderItems.push({
                    bookId: item.bookId,
                    bookName: book.name,
                    quantity: item.quantity,
                    price: item.price
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: `Book with ID ${item.bookId} not found`
                });
            }
        }

        // Create order in Orders collection only
        const newOrder = new Order({
            userId: userId,
            userName: user.fullname,
            items: orderItems,
            totalAmount: totalAmount,
            shippingAddress: {
                street: shippingAddress || "",
                city: "",
                state: "",
                zipCode: "",
                country: ""
            },
            paymentMethod: paymentMethod === "COD" ? "cash_on_delivery" : paymentMethod,
            status: "pending"
        });

        const savedOrder = await newOrder.save();
        console.log(`✅ Order created successfully: ${savedOrder._id} for user: ${user.fullname}`);

        // Clear user's cart after successful order
        user.cart = [];
        await user.save();

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: {
                _id: savedOrder._id,
                orderId: savedOrder._id,
                items: savedOrder.items,
                totalAmount: savedOrder.totalAmount,
                shippingAddress: savedOrder.shippingAddress.street,
                paymentMethod: savedOrder.paymentMethod,
                status: savedOrder.status,
                createdAt: savedOrder.createdAt,
                updatedAt: savedOrder.updatedAt
            }
        });

    } catch (error) {
        console.error("❌ Error creating order:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error while creating order"
        });
    }
}

const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate ObjectId format
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Fetch orders from Orders collection only
        const orders = await Order.find({ userId: userId })
            .populate('items.bookId', 'name author price images')
            .sort({ createdAt: -1 });

        console.log(`✅ Fetched ${orders.length} orders for user: ${user.fullname}`);

        // Transform orders to match frontend expected format
        const transformedOrders = orders.map(order => ({
            _id: order._id,
            orderId: order._id.toString(),
            items: order.items,
            totalAmount: order.totalAmount,
            shippingAddress: order.shippingAddress?.street || order.shippingAddress,
            paymentMethod: order.paymentMethod === 'cash_on_delivery' ? 'COD' : order.paymentMethod,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        }));

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders: transformedOrders,
            metadata: {
                totalOrders: orders.length,
                userId: userId,
                userName: user.fullname
            }
        });

    } catch (error) {
        console.error("❌ Error fetching user orders:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error while fetching orders"
        });
    }
}

const getOrderDetails = async (req, res) => {
    try {
        const { userId, orderId } = req.params;
        
        // Validate ObjectId format
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const order = user.orders?.find(o => o.orderId === orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order details fetched successfully",
            order
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching order details"
        });
    }
}

const cancelOrder = async (req, res) => {
    try {
        const { userId, orderId } = req.params;
        
        // Validate ObjectId format
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const order = user.orders?.find(o => o.orderId === orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending orders can be cancelled"
            });
        }

        order.status = "cancelled";
        order.updatedAt = new Date();
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while cancelling order"
        });
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { userId, orderId } = req.params;
        const { status } = req.body;
        
        // Validate ObjectId format
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format"
            });
        }

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const order = user.orders?.find(o => o.orderId === orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.status = status;
        order.updatedAt = new Date();
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while updating order status"
        });
    }
}

// Admin: Get all orders
const getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = PAGINATION_LIMITS.BOOKS_PER_PAGE, status, search } = req.query;
        let query = {};

        // Filter by status if specified
        if (status) {
            query.status = status;
        }

        // Search functionality (by user name)
        if (search) {
            query.userName = { $regex: search, $options: "i" };
        }

        const skip = (page - 1) * limit;
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('userId', 'fullname email')
            .populate('items.bookId', 'name price');

        const total = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message
        });
    }
};

// Admin: Update order status  
const updateOrderStatusAdmin = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be one of: " + validStatuses.join(', ')
            });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate('userId', 'fullname email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            success: false,
            message: "Error updating order status",
            error: error.message
        });
    }
};

export {
    createOrder,
    getUserOrders,
    getOrderDetails,
    cancelOrder,
    updateOrderStatus,
    getAllOrders,
    updateOrderStatusAdmin
}
