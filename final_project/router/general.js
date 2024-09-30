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

// Simulate fetching the book list
const fetchBooks = () => {
    return new Promise((resolve) => {
        // Simulate delay for fetching data
        setTimeout(() => {
            resolve(books);
        }, 100);
    });
};

// Simulate fetching book by ISBN
const fetchBookByISBN = (isbn) => {
    return new Promise((resolve) => {
        // Simulate delay for fetching data
        setTimeout(() => {
            resolve(books[isbn] || null);
        }, 100);
    });
};

// Simulate filtering books by author
const fetchBooksByAuthor = (author) => {
    return new Promise((resolve) => {
        // Simulate delay for fetching data
        setTimeout(() => {
            const filteredBooks = Object.entries(books).filter(([_, book]) => book.author.toLowerCase() === author);
            resolve(filteredBooks);
        }, 100);
    });
};

// Simulate filtering books by title
const fetchBooksByTitle = (title) => {
    return new Promise((resolve) => {
        // Simulate delay for fetching data
        setTimeout(() => {
            const filteredBooks = Object.entries(books).filter(([_, book]) => book.title.toLowerCase() === title);
            resolve(filteredBooks);
        }, 100);
    });
};


// Get the book list available in the shop
public_users.get('/',function (req, res) {
   // Send JSON response with formatted book data
    res.send(JSON.stringify(books,null,"\t"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Retrieve the email parameter from the request URL and send the corresponding friend's details
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
 public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();
    const filteredBooks = Object.entries(books).filter(([isbn, book]) => book.author.toLowerCase() === author);

    if (filteredBooks.length > 0) {
        
        const result = filteredBooks.map(([isbn, book]) => ({
            isbn: isbn,
            title: book.title,
            reviews: book.reviews
        }));

        res.send(({booksbyauthor: result}));
    } else {
        res.status(404).send("No books found for this author.");
    }
});

// Get abook details based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase();
    const filteredBooks = Object.entries(books).filter(([isbn, book]) => book.title.toLowerCase() === title);

    if (filteredBooks.length > 0) {
        const result = filteredBooks.map(([isbn, book]) => ({
            ibsn: isbn,
            author: book.author,
            reviews: book.reviews
        }));

        res.send({booksbytitle: result});
    } else {
        res.status(404).send("No reviews found for this title.");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    res.send(book.reviews);
});

module.exports.general = public_users;
