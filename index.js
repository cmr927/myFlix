const express = require('express');
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topMovies = [
  {
    title: 'Home Alone',
    year: 1990,
    director: 'Chris Columbus'
  },
  {
    title: 'Home Alone 2: Lost in New York',
    year: 1992,
    director: 'Chris Columbus'
  },
  {
    title: 'How the Grinch Stole Christmas!',
    year: 1966,
    director: 'Chuck Jones, Ben Washam'
  },
  {
    title: 'How the Grinch Stole Christmas',
    year: 2000,
    director: 'Ron Howard'
  },
  {
    title: 'A Christmas Carol',
    year: 1984,
    director: 'Clive Donner'
  },
  {
    title: 'The Muppet Christmas Carol',
    year: 1992,
    director: 'Brian Henson'
  },
  {
    title: 'Rudolph the Red-Nosed Reindeer',
    year: 1964,
    director: 'Larry Roemer'
  },
  {
    title: 'Elf',
    year: 2003,
    director: 'Jon Favreau'
  },
  {
    title: 'A Christmas Story',
    year: 1983,
    director: 'Bob Clark'
  },
  {
    title: 'Die Hard',
    year: 1988,
    director: 'John McTiernan'
  },
];

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my favorite Christmas movies!');
});


app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.use('/', express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});