import Book from "../model/book.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { PAGINATION_LIMITS } from "../utils/constants.js";

const getAllBooks = async (req, res)=>{
    try {
        const { genre, sortBy, page = 1, limit = PAGINATION_LIMITS.BOOKS_PER_PAGE, search, maxPrice, minRating, language } = req.query;
        let query = {};

        // Search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { authorName: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // Filter by genre
        if (genre) {
            query.genre = { $in: genre.split(",") };
        }

        // Filter by price range
        if (maxPrice) {
            query.price = { $lte: parseInt(maxPrice) };
        }

        // Filter by minimum rating
        if (minRating) {
            query.rating = { $gte: parseInt(minRating) };
        }

        // Filter by language
        if (language) {
            query.language = { $regex: language, $options: "i" };
        }

        // Sorting
        let sortOption = {};
        if (sortBy === "price-asc") {
            sortOption = { price: 1 };
        } else if (sortBy === "price-desc") {
            sortOption = { price: -1 };
        } else if (sortBy === "rating") {
            sortOption = { rating: -1 };
        } else if (sortBy === "newest") {
            sortOption = { _id: -1 };
        }

        const skip = (page - 1) * limit;
        const books = await Book.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Book.countDocuments(query);

        res.status(200).json({
            success: true,
            message: "all books fetched successfully",
            books,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json(error);
    }
}

// Search books with enhanced filtering
const searchBooks = async (req, res) => {
    try {
        const { q, genre, sortBy, page = 1, limit = PAGINATION_LIMITS.BOOKS_PER_PAGE, maxPrice, minRating, language } = req.query;
        
        if (!q || q.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        let query = {
            $or: [
                { name: { $regex: q.trim(), $options: "i" } },
                { authorName: { $regex: q.trim(), $options: "i" } },
                { description: { $regex: q.trim(), $options: "i" } },
                { genre: { $regex: q.trim(), $options: "i" } }
            ]
        };

        // Apply additional filters
        if (genre) {
            query.genre = { $in: genre.split(",") };
        }

        if (maxPrice) {
            query.price = { $lte: parseInt(maxPrice) };
        }

        if (minRating) {
            query.rating = { $gte: parseInt(minRating) };
        }

        if (language) {
            query.language = { $regex: language, $options: "i" };
        }

        // Sorting
        let sortOption = {};
        if (sortBy === "price-asc") {
            sortOption = { price: 1 };
        } else if (sortBy === "price-desc") {
            sortOption = { price: -1 };
        } else if (sortBy === "rating") {
            sortOption = { rating: -1 };
        } else if (sortBy === "newest") {
            sortOption = { _id: -1 };
        } else {
            // Default relevance sorting (by rating then newest)
            sortOption = { rating: -1, _id: -1 };
        }

        const skip = (page - 1) * limit;
        const books = await Book.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Book.countDocuments(query);

        res.status(200).json({
            success: true,
            message: `Found ${total} books for "${q}"`,
            books,
            searchQuery: q,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.log("Error in searchBooks: ", error);
        res.status(500).json({
            success: false,
            message: "Error searching books",
            error: error.message
        });
    }
};

const getBook = async (req, res) => {
    try {
        const {bookId} = req.params;
    
        if(!bookId){
            return res.status(401).json({
                success:false,
                message:"Book id is missing",
            })
        }
    
        const book =await Book.findById(bookId);
    
        if(!book){
            return res.status(404).json({
                success:false,
                message:"Book does not found"
            })
        }
    
        return res.status(200).json({
            success:true,
            message:"Book is fetched successfully",
            book
        })
    } catch (error) {
        console.log("Error :", error);
        res.status(500).json(error)
    }
}

const addBook = async(req, res)=>{
    try {
        const {name, authorName, genre, price, publishYear, description, inStock, language, rating, isbn, pageCount, publisher} = req.body;
        
        // Convert genre from string to array if it's a string
        let genreArray;
        if (typeof genre === 'string') {
            genreArray = genre.split(',').map(g => g.trim()).filter(g => g.length > 0);
        } else if (Array.isArray(genre)) {
            genreArray = genre;
        } else {
            genreArray = [];
        }
    
        if([name, authorName, description, language].some((field) => typeof field === 'string' && field.trim() === "") || !genreArray.length || !price || !publishYear || inStock === undefined || rating === undefined){
            return res.status(400).json( {
                success:false,
                message:"All fields are required"
            });
        }

        const existedBook = await Book.findOne({name});
    
        if(existedBook){
            return res.status(401).json({
                success:false,
                message:"Book with name already exists"
            });
        }
    
        const coverImageLocalPath = req.file?.path;
    
        if(!coverImageLocalPath){
            return res.status(401).json({
                success:false,
                message:"CoverImage is required"});
        }
    
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    
        if(!coverImage){
            return res.status(401).json({
                success:false,
                message:"Error while uploading coverImage on cloudinary"});
        }

        const book = await Book.create({
            name,
            authorName,
            genre: genreArray, 
            price,
            coverImage:coverImage.url,
            publishYear,
            description, 
            inStock, 
            language, 
            rating,
            isbn: isbn || '',
            pageCount: pageCount || 0,
            publisher: publisher || ''
        })

        return res.status(201).json({
            success:true,
            message:"Book is added successfully",
            book
        })
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Internal server error"
        })
    }
}

const deleteBook = async(req, res)=>{
    try {
        const {bookId} = req.params;

        const book = await Book.findById(bookId);

        if(!book){
            return res.status(404).json({
                success:false,
                message:"book id is invalid"
            })
        }

        const result = await Book.deleteOne({_id:bookId});

        if(result.deleteCount === 0){
            return res.status(404).json({
                success:false,
                message: 'Document not found'
                })
        }

        return res.status(200).json({
            success:true,
            message:"Book is deleted successfully"
        })

    } catch (error) {

        return res.status(401).json({
            success:false,
            message:"Error while deleting a book"
        })
    }
}

const updateBook = async(req, res) => {
    try {
        const { bookId } = req.params;
        const { name, authorName, genre, price, publishYear, description, inStock, language, rating, isbn, pageCount, publisher } = req.body;

        if (!bookId) {
            return res.status(400).json({
                success: false,
                message: "Book ID is required"
            });
        }

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        // Convert genre from string to array if it's a string
        let genreArray;
        if (genre) {
            if (typeof genre === 'string') {
                genreArray = genre.split(',').map(g => g.trim()).filter(g => g.length > 0);
            } else if (Array.isArray(genre)) {
                genreArray = genre;
            } else {
                genreArray = book.genre;
            }
        } else {
            genreArray = book.genre;
        }

        // Handle cover image update
        let coverImage = book.coverImage;
        if (req.file) {
            const coverImageLocalPath = req.file.path;
            const uploadedImage = await uploadOnCloudinary(coverImageLocalPath);
            if (uploadedImage) {
                coverImage = uploadedImage.url;
            }
        }

        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            {
                name: name || book.name,
                authorName: authorName || book.authorName,
                genre: genreArray,
                price: price !== undefined ? price : book.price,
                publishYear: publishYear || book.publishYear,
                description: description || book.description,
                inStock: inStock !== undefined ? inStock : book.inStock,
                language: language || book.language,
                rating: rating !== undefined ? rating : book.rating,
                isbn: isbn !== undefined ? isbn : book.isbn,
                pageCount: pageCount !== undefined ? pageCount : book.pageCount,
                publisher: publisher !== undefined ? publisher : book.publisher,
                coverImage
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Book updated successfully",
            book: updatedBook
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while updating book"
        });
    }
}

const getBooksByGenre = async(req, res) => {
    try {
        const { genre } = req.params;
        const books = await Book.find({ genre: { $in: [genre] } });

        if (books.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No books found in this genre"
            });
        }

        return res.status(200).json({
            success: true,
            message: `Books in ${genre} genre fetched successfully`,
            books
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching books by genre"
        });
    }
}

const getPopularBooks = async(req, res) => {
    try {
        const { limit = PAGINATION_LIMITS.BOOKS_PER_PAGE } = req.query;
        const books = await Book.find()
            .sort({ rating: -1 })
            .limit(parseInt(limit));

        return res.status(200).json({
            success: true,
            message: "Popular books fetched successfully",
            books
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching popular books"
        });
    }
}

const addReview = async(req, res) => {
    try {
        const { bookId } = req.params;
        const { userId, rating, comment } = req.body;

        if (!bookId || !userId || !rating) {
            return res.status(400).json({
                success: false,
                message: "Book ID, User ID, and rating are required"
            });
        }

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        const review = {
            userId,
            rating,
            comment: comment || "",
            createdAt: new Date()
        };

        if (!book.reviews) {
            book.reviews = [];
        }

        book.reviews.push(review);

        // Update average rating
        const totalRating = book.reviews.reduce((sum, r) => sum + r.rating, 0);
        book.rating = parseFloat((totalRating / book.reviews.length).toFixed(1));

        await book.save();

        return res.status(201).json({
            success: true,
            message: "Review added successfully",
            book
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while adding review"
        });
    }
}

const getReviews = async(req, res) => {
    try {
        const { bookId } = req.params;

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            reviews: book.reviews || [],
            averageRating: book.rating
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching reviews"
        });
    }
}

export {
    getAllBooks,
    getBook,
    addBook,
    deleteBook,
    updateBook,
    getBooksByGenre,
    getPopularBooks,
    addReview,
    getReviews,
    searchBooks
}