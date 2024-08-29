/**
 * @fileoverview Authentication and JWT token generation for the MyFlix API.
 * This module handles user login and token creation using Passport and JWT.
 */

const jwtSecret = 'process.env.JWT_SECRET'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'), // Library for creating and verifying JSON Web Tokens
  passport = require('passport'); // Passport.js for authentication

require('./passport'); // Your local passport file

bodyParser = require('body-parser') // Body-parser middleware to parse incoming request bodies

/**
 * @name JWT Token
 * @description Generates a JWT token for a user
 * @function generateJWTToken
 * @param {object} user - The user object
 * @returns {string} - The signed JWT token
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // This is the username you’re encoding in the JWT
    expiresIn: '7d', // This specifies that the token will expire in 7 days
    algorithm: 'HS256' // This is the algorithm used to “sign” or encode the values of the JWT
  });
}


/**
 * @name Auth
 * @module auth
 * @param {object} router - The Express router object
 */
module.exports = (router) => {
  /**
   * @name POST login route
   * @description Authenticates the user and generates a JWT token
   * @route POST /login
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Returns the user object and JWT token
   */

  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        console.log(error)
        console.log(user)
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}