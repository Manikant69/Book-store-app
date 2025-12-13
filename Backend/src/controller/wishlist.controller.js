import User from "../model/user.model.js";
import Book from "../model/book.model.js";

const addToWishlist = async (req, res) => {
    try {
        const { userId, bookId } = req.body;

        if (!userId || !bookId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Book ID are required"
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

        if (!user.wishlist) {
            user.wishlist = [];
        }

        if (user.wishlist.includes(bookId)) {
            return res.status(400).json({
                success: false,
                message: "Book already in wishlist"
            });
        }

        user.wishlist.push(bookId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Book added to wishlist successfully",
            wishlist: user.wishlist
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while adding to wishlist"
        });
    }
}

const getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate("wishlist");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Wishlist fetched successfully",
            wishlist: user.wishlist || []
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching wishlist"
        });
    }
}

const removeFromWishlist = async (req, res) => {
    try {
        const { userId, bookId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.wishlist || !user.wishlist.includes(bookId)) {
            return res.status(404).json({
                success: false,
                message: "Book not in wishlist"
            });
        }

        user.wishlist = user.wishlist.filter(id => id.toString() !== bookId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Book removed from wishlist successfully",
            wishlist: user.wishlist
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while removing from wishlist"
        });
    }
}

const checkInWishlist = async (req, res) => {
    try {
        const { userId, bookId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isInWishlist = user.wishlist && user.wishlist.includes(bookId);

        return res.status(200).json({
            success: true,
            isInWishlist
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while checking wishlist"
        });
    }
}

export {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    checkInWishlist
}
