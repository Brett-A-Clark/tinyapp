const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const userDatabase = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", userDatabase)
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });

  it("should return undefined with a non-existent email", function() {
    const user = getUserByEmail("user@example.com", userDatabase);
    const expectedOutput = udefined;
    assert.equal(user, expectedOutput);
  });
});