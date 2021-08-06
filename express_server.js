const express = require("express");
const app = express();
const PORT = 8080;
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const { getUserByEmail, generateRandomString, urlsForUser, cookieTracker } = require("./helpers")

app.use(express.urlencoded({extended: true}));
app.use(cookieSession({
  name: "session",
  keys: ["key1", "key2"]
}))

app.set("view engine", "ejs");

const urlDatabase = {};
const users = {};

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
    let templateVars = {
    urls: urlsForUser(req.session.user_ID, urlDatabase),
    user: users[req.session.user_ID],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    user: users[req.session.user_ID] 
  };
  if (!cookieTracker(req.session.user_ID, users)) {
    res.redirect("/login)");
  } else {
  res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      urlUserID: urlDatabase[req.params.shortURL].userID,
      user: users[req.session.user_ID],
    };
    res.render("urls_show", templateVars);
  } else {
    res.status(404).send("Sorry the page could not be found.");
  }
});

app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    if (longURL === undefined) {
      res.status(302);
    } else {
      res.redirect(longURL);
    }
  } else {
    res.status(404).send("Sorry the page could not be found.");
  }
});

app.post("/urls", (req, res) => {
  if (req.session.user_ID) {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = { 
      longURL: req.body.longURL,
      userID: req.session.user_ID,
    }; 
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.status(401).send("Request denied. Please provide valid authentication credentials.");
  }
});

app.post("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_ID;
  const userUrls = urlsForUser(userID, urlDatabase);
  if (Object.keys(userUrls).includes(req.params.id)) {
    const shortURL = req.params.id;
    urlDatabase[shortURL].longURL = req.body.newURL;
    res.redirect('/urls');
  } else {
    res.status(401).send("Request denied. Please provide valid authentication credentials");
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session.user_ID;
  const userUrls = urlsForUser(userID, urlDatabase);
  if (Object.keys(userUrls).includes(req.params.shortURL)) {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  } else {
    res.status(401).send("Request denied. Please provide valid authentication credentials.");
  }
});

app.get("/login", (req, res) => {
  const templateVars = { 
    user: users[req.session.user_ID] 
  };
  if (cookieTracker(req.session.user_ID, users)) {
    res.redirect("/urls");
  } else {
    res.render("login", templateVars);
  }
});

app.get("/register", (req, res) => {
  const templateVars = { 
    user: users[req.session.user_ID] 
  };
  if (cookieTracker(req.session.user_ID, users)) {
    res.redirect("/urls");
  } else {
    res.render("register", templateVars);
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  
  if (!getUserByEmail(email, users)) {
    res.status(403).send("Email not found");
  } else {
    const userID = getUserByEmail(email, users);
    if (!bcrypt.compareSync(password, users[userID].password)) {
      res.status(403).send("The password does not match. Please try again");
    } else {
      req.session.user_ID = userID;
    }
  }
      res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send("Email and/or password cannot be blank. Please try again.");
  } else if (getUserByEmail(email, users)) {
    res.status(400).send("The email already exists. Please try again.");
  } else {
    const newUserID = generateRandomString();
    users[newUserID] = {
      id: newUserID,
      email: email,
      password: bcrypt.hashSync(password, 10),
    };
    req.session.user_ID = newUserID;
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
