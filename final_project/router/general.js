const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "Customer already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register customer."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  let book = books[isbn];

  return res.send(JSON.stringify(book, null, 4));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  for (const key in books) {
    if(books[key].author == author) {
      return res.send(JSON.stringify(books[key], null, 4));
    }
  }

  return res.send(`Books with author ${author} not found!`);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  for (const key in books) {
    if(books[key].title == title) {
      return res.send(JSON.stringify(books[key], null, 4));
    }
  }

  return res.send(`Books with author ${author} not found!`);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let reviews = books[isbn].reviews;

  return res.send(JSON.stringify(reviews, null, 4));
});

module.exports.general = public_users;
