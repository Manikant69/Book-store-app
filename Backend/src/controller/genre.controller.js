import Genre from "../model/genre.model.js";
import Book from "../model/book.model.js";
import { DEFAULT_GENRE_IMAGES, DEFAULT_BOOK_IMAGE, PAGINATION_LIMITS } from "../utils/constants.js";

// Get all active genres
const getAllGenres = async (req, res) => {
    try {
        const genres = await Genre.find({ isActive: true }).sort({ name: 1 });
        res.status(200).json({
            success: true,
            message: "Genres fetched successfully",
            genres
        });
    } catch (error) {
        console.error("Error fetching genres:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching genres",
            error: error.message
        });
    }
};

// Add new genre (Admin only)
const addGenre = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Genre name is required"
            });
        }

        // Check if genre already exists
        const existingGenre = await Genre.findOne({ name: { $regex: name, $options: 'i' } });
        if (existingGenre) {
            return res.status(409).json({
                success: false,
                message: "Genre already exists"
            });
        }

        const genre = new Genre({
            name: name.trim(),
            description: description?.trim()
        });

        await genre.save();

        res.status(201).json({
            success: true,
            message: "Genre added successfully",
            genre
        });
    } catch (error) {
        console.error("Error adding genre:", error);
        res.status(500).json({
            success: false,
            message: "Error adding genre",
            error: error.message
        });
    }
};

// Update genre (Admin only)
const updateGenre = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, isActive } = req.body;

        const genre = await Genre.findByIdAndUpdate(
            id,
            { name, description, isActive },
            { new: true, runValidators: true }
        );

        if (!genre) {
            return res.status(404).json({
                success: false,
                message: "Genre not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Genre updated successfully",
            genre
        });
    } catch (error) {
        console.error("Error updating genre:", error);
        res.status(500).json({
            success: false,
            message: "Error updating genre",
            error: error.message
        });
    }
};

// Delete genre (Admin only)
const deleteGenre = async (req, res) => {
    try {
        const { id } = req.params;

        const genre = await Genre.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!genre) {
            return res.status(404).json({
                success: false,
                message: "Genre not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Genre deactivated successfully"
        });
    } catch (error) {
        console.error("Error deleting genre:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting genre",
            error: error.message
        });
    }
};

// Get popular genres with book counts
const getPopularGenres = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || PAGINATION_LIMITS.GENRES_PER_PAGE;
        
        // Get all active genres
        const genres = await Genre.find({ isActive: true });
        
        // Calculate book count for each genre
        const genresWithCounts = await Promise.all(
            genres.map(async (genre) => {
                const bookCount = await Book.countDocuments({ 
                    genre: { $in: [genre.name] },
                    inStock: true 
                });
                
                return {
                    _id: genre._id,
                    title: genre.name,
                    description: genre.description,
                    bookCount: bookCount,
                    imageUrl: genre.imageUrl || DEFAULT_GENRE_IMAGES[genre.name] || DEFAULT_BOOK_IMAGE
                };
            })
        );
        
        // Sort by book count (descending) and take the top genres
        const popularGenres = genresWithCounts
            .sort((a, b) => b.bookCount - a.bookCount)
            .slice(0, limit);
        
        res.status(200).json({
            success: true,
            message: "Popular genres fetched successfully",
            genres: popularGenres
        });
    } catch (error) {
        console.error("Error fetching popular genres:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching popular genres",
            error: error.message
        });
    }
};

export { getAllGenres, addGenre, updateGenre, deleteGenre, getPopularGenres };