const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  uuid = require('uuid');
// morgan = require('morgan');

// app.use(morgan('common'));

app.use(bodyParser.json());

let users = [
  {
    id: 1,
    name: "Kim",
    favoriteMovies: []
  },
  {
    id: 2,
    name: "Joe",
    favoriteMovies: ["The Fountain"]
  },

]

let movies = [
  {
    "Title": "The Fountain",
    "Description": "As a modern-day scientist, Tommy is struggling with mortality, desperately searching for the medical breakthrough that will save the life of his cancer-stricken wife, Izzi.",
    "Genre": {
      "Name": "Drama",
      "Description": "In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone."
    },

    "Director": {
      "Name": "Darren Aronofsky",
      "Bio": "Darren Aronofsky was born February 12, 1969, in Brooklyn, New York. Growing up, Darren was always artistic: he loved classic movies and, as a teenager, he even spent time doing graffiti art. After high school, Darren went to Harvard University to study film (both live-action and animation). He won several film awards after completing his senior thesis film, Supermarket Sweep, starring Sean Gullette, which went on to becoming a National Student Academy Award finalist. Aronofsky didn't make a feature film until five years later, in February 1996, where he began creating the concept for Pi (1998). After Darren's script for Pi (1998) received great reactions from friends, he began production. The film re-teamed Aronofsky with Gullette, who played the lead. This went on to further successes, such as Requiem for a Dream (2000), The Wrestler (2008) and Black Swan (2010). Most recently, he completed the films Noah (2014) and Mother! (2017).",
      "Birth": 1969.0
    },

  },
  {
    "Title": "The Princess Bride",
    "Description": "A bedridden boy's grandfather reads him the story of a farmboy-turned-pirate who encounters numerous obstacles, enemies and allies in his quest to be reunited with his true love.",
    "Genre": {
      "Name": "Action",
      "Description": "Action film is a film genre in which the protagonist or protagonists are thrust into a series of events that typically include violence, extended fighting, physical feats, rescues and frantic chases. Action films tend to feature a mostly resoursful hero struggling against incredible odds, which include life-threatening situations, a dangerous villain, or a pursuit which usually concludes in victory for the hero."
    },

    "Director": {
      "Name": "Rob Reiner",
      "Bio": "When Rob graduated high school, his parents advised him to participate in Summer Theatre. Reiner got a job as an apprentice in the Bucks County Playhouse in Pennsylvania. He went on to UCLA Film School to further his education. Reiner felt he still wasn't successful even having a recurring role on one of the biggest shows in the country, All in the Family. He began his directing career with the Oscar-nominated films This Is Spinal Tap, Stand By Me, and The Princess Bride.",
      "Birth": 1947.0
    },

  },
  {
    "Title": "The Hangover",
    "Description": "Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing. They make their way around the city in order to find their friend before his wedding.",
    "Genre": {
      "Name": "Comedy",
      "Description": "A category of film which emphasizes humor."
    },

    "Director": {
      "Name": "Todd Phillips",
      "Bio": "Todd Phillips is an American film director, producer, and screenwriter. Growing up on Long Island, New York, Todd Phillips fell in love with feature film teen comedies made in the 1980s, and claims they were his biggest influence in becoming a filmmaker. While studying film at New York University, he made a documentary called Hated (1994), using his credit cards to finance the filmâEUR(TM)s $13,000 budget. About an excessive punk rocker, GG Allen, the student film won an award at the New Orleans Film Festival and went on to be released both theatrically and on DVD. Phillips' next project was a documentary called Frat House (1998), which followed the trials of young men trying to get accepted into a fraternity. The film won the Grand Jury Prize at the Sundance Film Festival, but soon became banned from public viewing when the young men involved objected, and lawyers for their families stepped in.",
      "Birth": 1970.0
    },

  },

  {
    "Title": "My Neighbor Totoro",
    "Description": "When two girls move to the country to be near their ailing mother, they have adventures with the wondrous forest spirits who live nearby.",
    "Genre": {
      "Name": "Family",
      "Description": "Generally relates to children in the context of home and family. Children's films are made specifically for children and not necessarily for a general audience, while family films are made for a wider appeal with a general audience in mind."
    },

    "Director": {
      "Name": "Hayao Miyazaki",
      "Bio": "Hayao Miyazaki is 1 of Japan's greatest animation directors. The entertaining plots, compelling characters & breathtaking animation in his films have earned him international renown from critics as well as public recognition within Japan. He was born on January 5, 1941 in Tokyo. He started his career in 1963 as an animator at the studio Toei Douga studio, and was subsequently involved in many early classics of Japanese animation. From the beginning, he commanded attention with his incredible drawing ability and the seemingly endless stream of movie ideas he proposed.",
      "Birth": 1941.0
    },

  },

  {
    "Title": "Barbie",
    "Description": "Barbie suffers a crisis that leads her to question her world and her existence.",
    "Genre": {
      "Name": "Fantasy",
      "Description": "Speculative fiction involving magical elements, typically set in a fictional universe and usually inspired by mythology or folklore. "
    },

    "Director": {
      "Name": "Greta Gerwig",
      "Bio": "Greta Gerwig is an American actress, playwright, screenwriter, and director. She has collaborated with Noah Baumbach on several films, including Greenberg (2010), Frances Ha (2012), for which she earned a Golden Globe nomination, and Mistress America (2015). Gerwig made her solo directorial debut with the critically acclaimed comedy-drama film Lady Bird (2017), which she also wrote, and has also had starring roles in the films Damsels in Distress (2011), Jackie (2016), and 20th Century Women (2016).      ",
      "Birth": 1983.0
    },

  },

];

// CREATE
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('users need names')
  }
})

// UPDATE
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find(user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user')
  }

})

// CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);;
  } else {
    res.status(400).send('no such movie')
  }

})

// DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);;
  } else {
    res.status(400).send('cannot remove movie')
  }

})

// DELETE
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    users = users.filter(user => user.id != id);
    res.status(200).send(`user ${id} has been deleted`);
  } else {
    res.status(400).send('no such user')
  }

})

// READ
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
})

// READ
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find(movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie')
  }
})

// READ
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre')
  }

})

// READ
app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(movie => movie.Director.Name === directorName).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('no such director')
  }

})

app.use('/', express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});