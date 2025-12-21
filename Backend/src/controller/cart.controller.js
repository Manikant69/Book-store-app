import User from "../model/user.model.js";
import Book from "../model/book.model.js";

const addToCart = async (req, res) => {
    try {
        const { userId, bookId, quantity } = req.body;

        if (!userId || !bookId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "User ID, Book ID, and quantity are required"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        if (!user.cart) {
            user.cart = [];
        }

        const existingItem = user.cart.find(item => item.bookId.toString() === bookId.toString());

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({
                bookId: bookId.toString(),
                quantity,
                price: book.price
            });
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Book added to cart successfully",
            cart: user.cart
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while adding to cart"
        });
    }
}

const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate({
            path: "cart.bookId",
            model: "Book"
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Transform cart items to include book data properly
        const cartItems = user.cart.map(item => ({
            bookId: item.bookId._id,
            book: item.bookId, // This contains the populated book data
            quantity: item.quantity,
            price: item.price,
            _id: item._id
        }));

        const total = user.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            cart: cartItems,
            total
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching cart"
        });
    }
}

const removeFromCart = async (req, res) => {
    try {
        const { userId, bookId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Convert bookId to string for comparison
        const bookIdStr = bookId.toString();
        const initialLength = user.cart.length;
        
        user.cart = user.cart.filter(item => item.bookId.toString() !== bookIdStr);
        
        if (user.cart.length === initialLength) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }
        
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Book removed from cart successfully",
            cart: user.cart
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while removing from cart"
        });
    }
}

const updateCartQuantity = async (req, res) => {
    try {
        const { userId, bookId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Convert bookId to string for comparison
        const bookIdStr = bookId.toString();
        const cartItem = user.cart.find(item => item.bookId.toString() === bookIdStr);

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

        cartItem.quantity = quantity;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated successfully",
            cart: user.cart
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while updating cart"
        });
    }
}

const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.cart = [];
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully"
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while clearing cart"
        });
    }
}

export {
    addToCart,
    getCart,
    removeFromCart,
    updateCartQuantity,
    clearCart
}
