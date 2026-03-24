const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists. Please provide a different username" });
  }

  users.push({
    username: username,
    password: password
  });
  return res.status(201).json({message: "User registered successfully!" });
});

// Task 1 & 10: Get all books using Async-Await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        if (books) {
          resolve(books);
        } else {
          reject("No books found");
        }
      });
    };
    const bookList = await getBooks();
    res.send(JSON.stringify(bookList, null, 2));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error });
  }
});

// Task 2 & 11: Get book by ISBN using Async-Await
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const getBookByISBN = () => {
      return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject("Book not found");
        }
      });
    };
    const book = await getBookByISBN();
    res.send(JSON.stringify(book, null, 2));
  } catch (error) {
    res.status(404).json({ message: "Book not found with ISBN: " + req.params.isbn });
  }
});

// Task 3 & 12: Get books by author using Async-Await
public_users.get('/author/:author', async function (req, res) {
  try {
    const authorName = req.params.author;
    const getBooksByAuthor = () => {
      return new Promise((resolve, reject) => {
        const matchingBooks = [];
        const bookKeys = Object.keys(books);
        
        for (let i = 0; i < bookKeys.length; i++) {
          const isbn = bookKeys[i];
          const book = books[isbn];
          
          if (book.author === authorName) {
            matchingBooks.push({
              isbn: isbn,
              title: book.title,
              author: book.author,
              reviews: book.reviews
            });
          }
        }
        
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject("No books found by this author");
        }
      });
    };
    const booksByAuthor = await getBooksByAuthor();
    res.send(JSON.stringify(booksByAuthor, null, 2));
  } catch (error) {
    res.status(404).json({ message: "No books found by author: " + req.params.author });
  }
});

// Task 4 & 13: Get books by title using Async-Await
public_users.get('/title/:title', async function (req, res) {
  try {
    const bookTitle = req.params.title;
    const getBooksByTitle = () => {
      return new Promise((resolve, reject) => {
        const matchingBooks = [];
        const bookKeys = Object.keys(books);
        
        for (let i = 0; i < bookKeys.length; i++) {
          const isbn = bookKeys[i];
          const book = books[isbn];
          
          if (book.title === bookTitle) {
            matchingBooks.push({
              isbn: isbn,
              title: book.title,
              author: book.author,
              reviews: book.reviews
            });
          }
        }
        
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject("No books found with this title");
        }
      });
    };
    const booksByTitle = await getBooksByTitle();
    res.send(JSON.stringify(booksByTitle, null, 2));
  } catch (error) {
    res.status(404).json({ message: "No books found with title: " + req.params.title });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    if (book.reviews && Object.keys(book.reviews).length > 0) {
        res.send(JSON.stringify(book.reviews, null, 2));
    } else {
        res.json({ message: "No reviews found for this book" })
    }
  } else {
    res.status(404).json({ message: "Book not found with ISBN: " + isbn });
  }
});

module.exports.general = public_users;