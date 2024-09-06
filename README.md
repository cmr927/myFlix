# MyFlix API
This is a custom RESTful API built with Node.js and Express, which provides information about movies, titles, descriptions, genres, directors, images, features, users, and more.

This API is used for the frontend apps [myFlix React](https://github.com/cmr927/myFlix-client) and [myFlix Angular](https://github.com/cmr927/myFlix-Angular-client).

## Database
This database is built mainly on the MERN tech stack. Mongoose and MongoDB were used to create and connect the individual movie objects to a database. The API is hosted on MongoDB and the frontend is hosted on Netlify.

## Link to Project Documentation
[https://movies-myflix-cmr927-6d25967ba551.herokuapp.com/documentation.html](https://movies-myflix-cmr927-6d25967ba551.herokuapp.com/documentation.html)

## Features
- Return a list of ALL movies to the user
- Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
- Return data about a genre (description) by name/title (e.g., “Thriller”)
- Return data about a director (bio, birth year, death year) by name
- Allow new users to register
- Allow users to update their user info (username, password, email, date of birth)
- Allow users to add a movie to their list of favorites
- Allow users to remove a movie from their list of favorites
- Allow existing users to deregister
- Allow existing users to login and get a JWT token

## Installation
1. Clone this repository: `git clone https://github.com/yourusername/movie-api.git`
2. Navigate into the project directory: `cd movie-api`
3. Install dependencies: `npm install`
4. Start the server: `npm start`

## Dependencies
- bcrypt
- body-parser
- cors
- express
- jsonwebtoken
- lodash
- mongoose
- morgan
- passport
- uuid

## API Endpoints
- `GET /movies`: Return a list of ALL movies to the user
- `GET /movies/:Title`: Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
- `GET /movies/genres/:genreName`: Return data about a genre (description) by name/title (e.g., “Thriller”)
- `GET movies/directors/:Name`: Return data about a director (bio, birth year, death year) by name
- `GET /users/:username`: Return a user by their username
- `POST /users`: Allow new users to register
- `PUT /users/:username`: Allow users to update their user info (username, password, email, date of birth)
- `POST /users/:Username/movies/:MovieID`: Allow users to add a movie to their list of favorites
- `DELETE /users/:Username/movies/:MovieID`: Allow users to remove a movie from their list of favorites
- `DELETE /users/:username`: Allow existing users to deregister (showing only a text that a user email has been removed)
- `POST /login/:username:password`: Allow existing users to login and get a JWT token

## Authentication
This API uses JWT for authentication. All endpoints require a valid JWT token in the Authorization header.

## License
This project is licensed under the terms of the [ISC License](https://opensource.org/licenses/ISC).

