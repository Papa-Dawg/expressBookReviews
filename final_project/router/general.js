const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).send("Customer successfully registered. Now you can login");
        } else {
            return res.status(404).send("Customer already exists!");
        }
    }
    // Return error if username or password is missing
    return res.status(404).send("Unable to register customer.");
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    const fetchBooks = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(books);
        }, 100);
    });
};
    try {
        const allBooks = await fetchBooks();
        res.send(JSON.stringify(allBooks, null, "\t"));
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving books.");
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    const fetchBookByISBN = (isbn) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(books[isbn] || null);
        }, 100);
    });
};
    try {
        const book = await fetchBookByISBN(isbn);
        if (book) {
            res.send(book);
        } else {
            res.status(404).send("Book not found.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving book.");
    }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();
    const fetchBooksByAuthor = (author) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredBooks = Object.entries(books).filter(([_, book]) => book.author.toLowerCase() === author);
            resolve(filteredBooks);
        }, 100);
    });
};
    try {
        const filteredBooks = await fetchBooksByAuthor(author);
        if (filteredBooks.length > 0) {
            const result = filteredBooks.map(([isbn, book]) => ({
                isbn: isbn,
                title: book.title,
                reviews: book.reviews
            }));
            res.send({ booksbyauthor: result });
        } else {
            res.status(404).send("No books found for this author.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving books.");
    }
});

// Get book details based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();
    const fetchBooksByTitle = (title) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredBooks = Object.entries(books).filter(([_, book]) => book.title.toLowerCase() === title);
            resolve(filteredBooks);
        }, 100);
    });
};
    try {
        const filteredBooks = await fetchBooksByTitle(title);
        if (filteredBooks.length > 0) {
            const result = filteredBooks.map(([isbn, book]) => ({
                ibsn: isbn,
                author: book.author,
                reviews: book.reviews
            }));
            res.send({ booksbytitle: result });
        } else {
            res.status(404).send("No reviews found for this title.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving books.");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    res.send(book.reviews);
});

module.exports.general = public_users;
