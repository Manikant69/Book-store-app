import express from "express";
import { getAllGenres, addGenre, updateGenre, deleteGenre, getPopularGenres } from "../controller/genre.controller.js";

const genreRoute = express.Router();

// Public routes
genreRoute.get("/", getAllGenres);
genreRoute.get("/popular", getPopularGenres);

// Admin routes (you can add auth middleware later)
genreRoute.post("/", addGenre);
genreRoute.put("/:id", updateGenre);
genreRoute.delete("/:id", deleteGenre);

export default genreRoute;