const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let getBooks = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000)
  }
)

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
// public_users.get('/', function (req, res) {
//   return res.send(JSON.stringify(books, null, 4));
// });

// task 10 async
public_users.get('/', async (req, res) => {
  let abooks = await getBooks; //Get books from promise object
  return res.send(JSON.stringify(abooks, null, 4)); 
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   const isbn = req.params.isbn;

//   let book = books[isbn];

//   return res.send(JSON.stringify(book, null, 4));
// });

// task 11 async
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  let book = await getBooks; //Get books from promise object

  return res.send(JSON.stringify(book[isbn], null, 4));
});
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   const author = req.params.author;

//   for (const key in books) {
//     if(books[key].author == author) {
//       return res.send(JSON.stringify(books[key], null, 4));
//     }
//   }

//   return res.send(`Books with author ${author} not found!`);
// });

// Task 12 Async
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  let abooks = await getBooks; //Get books from promise object

  for (const key in abooks) {
    if(books[key].author == author) {
      return res.send(JSON.stringify(books[key], null, 4));
    }
  }

  return res.send(`Books with author ${author} not found!`);
});

// Task 13 Async
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  let abooks = await getBooks; //Get books from promise object

  for (const key in abooks) {
    if(books[key].title == title) {
      return res.send(JSON.stringify(books[key], null, 4));
    } 
  }

  return res.send(`Books with title ${title} not found!`);
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   const title = req.params.title;

//   for (const key in books) {
//     if(books[key].title == title) {
//       return res.send(JSON.stringify(books[key], null, 4));
//     }
//   }

//   return res.send(`Books with title ${title} not found!`);
// });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let reviews = books[isbn].reviews;

  return res.send(JSON.stringify(reviews, null, 4));
});

module.exports.general = public_users;
