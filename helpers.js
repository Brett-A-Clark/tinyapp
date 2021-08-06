const getUserByEmail = function(email, userDatabase) {
  for (const user in userDatabase) {
    if (userDatabase[user].email === email) {
      return user;
    }
  }
  return null;
};

function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}

const urlsForUser = function (id, urlDatabase) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
};

const cookieTracker = function (cookie, userDatabase) {
  for (const user in userDatabase) {
    if (cookie === user) {
      return true;
    } 
  }
};

module.exports = { getUserByEmail, generateRandomString, urlsForUser, cookieTracker };