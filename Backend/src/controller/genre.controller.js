import Genre from "../model/genre.model.js";
import Book from "../model/book.model.js";

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
        const limit = parseInt(req.query.limit) || 6;
        
        // Get all active genres
        const genres = await Genre.find({ isActive: true });
        
        // Calculate book count for each genre
        const genresWithCounts = await Promise.all(
            genres.map(async (genre) => {
                const bookCount = await Book.countDocuments({ 
                    genre: { $in: [genre.name] },
                    inStock: true 
                });
                
                // Default genre images - you can update these or store them in the database
                const genreImages = {
                    'Fiction': 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80',
                    'Mystery': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
                    'Historical Fiction': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
                    'History': 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
                    'Science Fiction': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
                    'Romance': 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&w=800&q=80',
                    'Biography': 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&w=800&q=80',
                    'Self-Help': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
                    'Fantasy': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
                    'Horror': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
                    'Thriller': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
                };
                
                return {
                    _id: genre._id,
                    title: genre.name,
                    description: genre.description,
                    bookCount: bookCount,
                    imageUrl: genre.imageUrl || genreImages[genre.name] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
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