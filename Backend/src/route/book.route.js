import express from "express";
import { getAllBooks, getBook, addBook, deleteBook, updateBook, getBooksByGenre, getPopularBooks, addReview, getReviews, searchBooks } from "../controller/book.controller.js";
import {upload} from "../middleware/multer.middleware.js"

const router = express.Router();

// Search route (must come before parameterized routes)
router.route("/search").get(searchBooks);

router.route("/").get(getAllBooks);
router.route("/popular").get(getPopularBooks);
router.route("/genre/:genre").get(getBooksByGenre);
router.route("/:bookId").get(getBook);
router.route("/add").post(upload.single("coverImage"), addBook);
router.route("/update/:bookId").put(upload.single("coverImage"), updateBook);
router.route("/delete/:bookId").delete(deleteBook);
router.route("/:bookId/reviews").get(getReviews);
router.route("/:bookId/reviews/add").post(addReview);

export default router;
