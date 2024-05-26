const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        username: username,
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("Customer successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  let book_reviews = books[isbn].reviews;

  if (Object.keys(book_reviews).length == 0) {
    //First entry
    books[isbn].reviews = { [username]: review };
  } else {
    for (const key in book_reviews) {
      //Update the review
      if (key == username) {
        books[isbn].reviews[key] = review;
      }
    }
    books[isbn].reviews = { [username]: review }; //Create the review
  }

  return res.send(
    `The review for the book with ISBN ${isbn} has been added/updated.`
  );
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  let book_reviews = books[isbn].reviews;

  if (book_reviews[username]) {
    delete book_reviews[username];

    return res.send(
      `Reviews for the ISBN ${isbn} by the user ${username} deleted.`
    );
  } else {
    return res.send(`Unable to find reviews by the user ${username}!`);
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
