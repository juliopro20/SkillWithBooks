import BookJson from "./Bookstore.books.json" with { type: "json" };
import Book from './models/Book.js';

export const seedBookData = async () => {
    try {
        //connection to the database
        await Book.deleteMany({}); // Clear existing data
        await Book.insertMany(BookJson); // Insert new data
        console.log("Book data seeded successfully.");
    } catch (error) {
        console.error("Error seeding book data:", error);
    }
}