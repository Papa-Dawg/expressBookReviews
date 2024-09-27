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
            return res.status(200).json({message: "Customer successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "Customer already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register customer."});
});

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
  
 public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();
    const filteredBooks = Object.entries(books).filter(([isbn, book]) => book.author.toLowerCase() === author);

    if (filteredBooks.length > 0) {
        // Map the filtered books to include the ISBN and details
        const result = filteredBooks.map(([isbn, book]) => ({
            isbn: isbn,
            title: book.title,
            reviews: book.reviews
        }));

        // Wrap the result in an object
        res.send(({booksbyauthor: result}));
    } else {
        res.status(404).send({ message: 'No books found for this author.' });
    }
});

// Get all books based on title
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
        res.status(404).send({ message: 'No reviews found for this title.' });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    res.send(book.reviews);
});

module.exports.general = public_users;
