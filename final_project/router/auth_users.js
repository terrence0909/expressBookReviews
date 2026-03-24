const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
// Check if username exists in users array
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
// Check if username and password match the one we have in records.
  const user = users.find(u => u.username === username);
  return user && user.password === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user exists and credentials are valid
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT token
  const accessToken = jwt.sign({ username: username }, "access", { expiresIn: '1h' });

  // Store token in session
  req.session.authorization = {
    accessToken: accessToken
  };
  return res.status(200).json({ message: "Login successful!", token: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  // Check if review is provided
  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  // Check if book exist
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found"});
  }

  // Add or modify the review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/modified successfully!",
    reviews: books[isbn].reviews
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if reviews exist for this book
    if (!books[isbn].reviews) {
        return res.status(404).json({ message: "No reviews found for this book" });
    }

    // Check if the user has a review for this book
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "You have not reviewed this book" });
    }

    // Delete the user's review
    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Review deleted successfully!",
        reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
