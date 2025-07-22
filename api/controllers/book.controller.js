import Book from '../models/Book.js';

export const getBooks = async (req, res, next) => {
    try {
        const books = await Book.find();
        res.status(200).json({
            message: "Books fetched successfully",
            success: true,
            data: books
        });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}