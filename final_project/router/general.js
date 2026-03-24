const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  // Get username and password from request parameters
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if username already exists
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists. Please provide a different username" });
  }

  // Register the new user
  users.push({
    username: username,
    password: password
  });
  return res.status(201).json({message: "User registered successfully!" });
});

// Task 10: Get the book list using Async-Await with Axios
public_users.get('/async-books', async function (req, res) {
  try {
    // Simulate async operation to get books
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

// Task 1: Original sync version (keeping for backward compatibility)
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 2));
});

// Task 11: Get book details based on ISBN using Async-Await
public_users.get('/async-isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    
    // Simulate async operation to get book by ISBN
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject("Book not found");
        }
      });
    };
    
    const book = await getBookByISBN(isbn);
    res.send(JSON.stringify(book, null, 2));
  } catch (error) {
    res.status(404).json({ message: "Book not found with ISBN: " + req.params.isbn });
  }
});

// Task 2: Original sync version (keeping for backward compatibility)
public_users.get('/isbn/:isbn', function (req, res) {
  // Get ISBN from request parameters
  const isbn = req.params.isbn;
  const book = books[isbn];

  // Check if book exists
  if (book) {
    res.send(JSON.stringify(book, null, 2));
  } else {
    res.status(404).json({ message: "Books not found with ISBN: " + isbn });
  }
});

// Task 12: Get book details based on author using Async-Await
public_users.get('/async-author/:author', async function (req, res) {
  try {
    const authorName = req.params.author;
    
    // Simulate async operation to get books by author
    const getBooksByAuthor = (authorName) => {
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
    
    const booksByAuthor = await getBooksByAuthor(authorName);
    res.send(JSON.stringify(booksByAuthor, null, 2));
  } catch (error) {
    res.status(404).json({ message: "No books found by author: " + req.params.author });
  }
});

// Task 3: Original sync version (keeping for backward compatibility)
public_users.get('/author/:author', function (req, res) {
  // Get author name from request parameter
  const authorName = req.params.author;
  const matchingBooks = [];

  // Get all book keys (ISBNs)
  const bookKeys = Object.keys(books);

  // Iterate through books and find matches by author
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
  // Check if any books were found
  if (matchingBooks.length > 0) {
    res.send(JSON.stringify(matchingBooks, null, 2));
  } else {
    res.status(404).json({ message: "No books found by author: " + authorName });
  }
});

// Task 13: Get book details based on title using Async-Await
public_users.get('/async-title/:title', async function (req, res) {
  try {
    const bookTitle = req.params.title;
    
    // Simulate async operation to get books by title
    const getBooksByTitle = (bookTitle) => {
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
    
    const booksByTitle = await getBooksByTitle(bookTitle);
    res.send(JSON.stringify(booksByTitle, null, 2));
  } catch (error) {
    res.status(404).json({ message: "No books found with title: " + req.params.title });
  }
});

// Task 4: Original sync version (keeping for backward compatibility)
public_users.get('/title/:title', function (req, res) {
  // Get title from request parameters
  const bookTitle = req.params.title;
  const matchingBooks = [];

  // Get all book keys (ISBNs)
  const bookKeys = Object.keys(books);

  // Iterate through books and find matches by title
  for (let i = 0; i < bookKeys.length; i++){
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
  // Check if any books were found
  if (matchingBooks.length > 0) {
    res.send(JSON.stringify(matchingBooks, null, 2));
  } else {
    res.status(404).json({ message: "No books were found with title: " + bookTitle });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  // Get ISBN from request parameters
  const isbn = req.params.isbn;
  const book = books[isbn];

  // Check if book exists
  if (book) {
    // Check if reviews exist and are not empty
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