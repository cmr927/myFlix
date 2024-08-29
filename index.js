/**
 * @fileoverview Main server file for the MyFlix API.
 * It sets up the server, connects to the database, and defines the API endpoints for user and movie management.
 */

// Import required modules
const mongoose = require('mongoose'); // Mongoose library for MongoDB interaction
const Models = require('./models.js'); // Import the data models

const express = require('express'); // Express framework

const app = express(); // Create an instance of Express

uuid = require('uuid'); // Library to generate unique IDs
morgan = require('morgan'); // HTTP request logger middleware

bodyParser = require('body-parser'); // Middleware to parse incoming request bodies

/**
 * @name Movie and User models
 * @description Movie and User models from the data layer.
 * @constant
 * @type {array}
 */
const Movies = Models.Movie;
const Users = Models.User;

// Middleware setup
app.use(bodyParser.json()); // Parse JSON bodies

app.use(express.json());

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use(morgan('common')); // Log HTTP requests

const { check, validationResult } = require('express-validator'); // Validation library

const cors = require('cors'); // CORS middleware
let allowedOrigins = ['http://0.0.0.0:8080', 'http://testsite.com', 'mongodb://0.0.0.0t:27017/cfDB', 'http://localhost:4200', 'https://cmr927-myflix.netlify.app', 'https://cmr927.github.io/myFlix-Angular-client/myFlix-Angular-client', 'https://cmr927.github.io', process.env.CONNECTION_URI];

/**
 * @name CORS configuration
 * @description CORS configuration: Allows requests only from specific origins.
 * @function

 */
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      let message = "The CORS policy for this application doesn't allow access from origin" + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

// Authentication setup
let auth = require('./auth')(app); // Import authentication logic
const passport = require('passport'); // Import Passport.js for authentication
require('./passport'); // Passport configuration

// Local database connection
// mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Online database connection
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

/**
 * @name Welcome message
 * @function
 * @description Default text response when at the root. READ, GET /
 * @returns {string} Welcome message.
 */
app.get("/", (req, res) => {
  res.send("Welcome to MyFlix!");
});

/**
 * @name Register a new user
 * @description Register a new user. Expects JSON in the request body. CREATE, POST /users
 * @async
 * @param {string} Username - User's username.
 * @param {string} Password - User's password.
 * @param {string} Email - User's email.
 * @param {Date} Birthday - User's birthday.
 * @returns {object} The newly created user.
 */
app.post('/users',
  /** 
   * Validation logic here for request 
   * you can either use a chain of methods like .not().isEmpty()
   * which means "opposite of isEmpty" in plain english "is not empty"
   * or use .isLength({min: 5}) which means
   * minimum value of 5 characters are only allowed
  */
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
  async (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

/**
 * @name Update user's information
 * @description Update an existing user's information. UPDATE, PUT /users/:Username
 * @async
 * @param {string} Username - New or existing username.
 * @param {string} Password - New or existing password.
 * @param {string} Email - New or existing email.
 * @param {Date} Birthday - New or existing birthday.
 * @returns {object} The updated user.
 */
app.put('/users/:Username',
  [
    passport.authenticate('jwt', { session: false }),
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], async (req, res) => {
    // CONDITION TO CHECK ADDED HERE
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send('Permission denied');
    }
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    // CONDITION ENDS
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set:
      {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
      { new: true }) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error: ' + err);
      })
  });

/**
 * @name Add movie to fav movies
 * @description Add a movie to a user's list of favorite movies. UPDATE, POST /users/:Username/movies/:MovieID
 * @async
 * @param {string} Username - The user's username.
 * @param {string} MovieID - The ID of the movie to add to favorites.
 * @returns {object} The updated user with the new favorite movie.
 */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
    { new: true })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * @name Delete movie from fav movies
 * @description Remove a movie from a user's list of favorite movies. DELETE /users/:Username/movies/:MovieID
 * @async
 * @param {string} Username - The user's username.
 * @param {string} MovieID - The ID of the movie to remove from favorites.
 * @returns {object} The updated user without the removed favorite movie.
 */
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID }
  },
    { new: true })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * @name Get all movies
 * @description Get a list of all movies. GET /movies
 * @async
 * @returns {array} A list of movie objects.
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

/**
 * @name Get user info
 * @description Get a user's information by username. READ, GET /users/:Username
 * @async
 * @param {string} Username - The user's username.
 * @returns {object} The user object.
 */
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * @name Delete a user
 * @description Delete a user by username. DELETE /users/:Username\
 * @async
 * @param {string} Username - The user's username.
 * @returns {string} Confirmation message.
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
  await Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * @name Get movie
 * @description Get a movie by title. GET /movies/:title
 * @async
 * @param {string} title - The title of the movie.
 * @returns {object} The movie object.
 */
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * @name Get movie's genre
 * @description Get a movie's genre by genre name. READ, GET /movies/genres/:genreName
 * @async
 * @param {string} genreName - The name of the genre.
 * @returns {object} The genre object.
 */
app.get('/movies/genres/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ "Genre.Name": req.params.genreName })
    .then((movies) => {
      res.json(movies.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


/**
 * @name Get director info
 * @description Get information on a movie's director by director name. READ, GET /movies/directors/:directorName
 * @async
 * @param {string} directorName - The name of the director.
 * @returns {object} The director object.
 */
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ "Director.Name": req.params.directorName })
    .then((movies) => {
      res.json(movies.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * @name Serve static files
 * @description Serve static files from the public directory. GET /
 */
app.use('/', express.static('public'));

/**
 * @name Global error handler
 * @description Global error handler for the application.
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Listen for requests and start the server
/**
 * @name Start the server
 * @description Start the server on the specified port.
 */
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});

// To test locally
// app.listen(8080, () => {
//   console.log('Your app is listening on port 8080.');
// });
