const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books.find(book => book.isbn === isbn);
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = books.filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
    if (booksByAuthor.length > 0) {
        res.status(200).json(booksByAuthor);
    } else {
        res.status(404).json({ message: "No books found by this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = books.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
    if (booksByTitle.length > 0) {
        res.status(200).json(booksByTitle);
    } else {
        res.status(404).json({ message: "No books found with this title" });
    }
});

// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books.find(book => book.isbn === isbn);
    if (book && book.review) {
        res.status(200).json(book.review);
    } else {
        res.status(404).json({ message: "No review found for this book" });
    }
});

module.exports.general = public_users;