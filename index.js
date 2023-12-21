const bodyParser = require('body-parser');
const express = require('express'),
fs = require('fs'),
morgan = require('morgan'),
path = require('path'),
uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies= Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb://localhost:27017/movieFlixDB', {useNewUrlParser: true, userUnifiedTopology: true});



const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'),{flags:'a'});

let users = [
    {
        id: 1,
        name: 'Kim',
        favoriteMovies: []
    },
    {
        id:2,
        name: 'Joe',
        favoriteMovies: ['Interstellar']
    }
];

let movies = [
    {
        Title: 'The Lord of the Rings: The Felloship of the Ring',
        Description: 'Several Hobbits along with their companions set out on a quest to destroy the One ring of Sauron.',
        Genre: {
            Name: 'Fantasy',
            Description: 'Is a genre of fiction that takes place in a world that follows different rules than our own.',
        },
        Director: {
            Name: 'Peter Jackson',
            Bio: 'Peter Jackson was born in New Zealand on October 31, 1961. As a child he enjoyed creating short films and then went on to direct a number of very successful film with no formal training.',
        }
    },
    {
        Title: 'The Lord of the Rings: The Two Towers',
        Descripton: 'After getting split up, the two Hobbits continue on to Mordor while the rest of their companions attempt to free the kingdom of Rohan from the grip of Sauron.',
        Genre:{
            Name: 'Fantasy',
            Description: 'Is a genre of fiction that takes place in a world that follows different rules than our own.',
        },
        Director: {
            Name: 'Peter Jackson',
            Bio: 'Peter Jackson was born in New Zealand on October 31, 1961. As a child he enjoyed creating short films and then went on to direct a number of very successful film with no formal training.',
        }
    },
    {
        Title: 'The Lord of the Rings: The Return of the King',
        Description: 'The Hobbits make their way into Mordor where the Ring can finally be destroyed, while their companions come face to face with Sauron and his army.',
        Genre:{
            Name: 'Fantasy',
            Description: 'Is a genre of fiction that takes place in a world that follows different rules than our own.',
        },
        Director: {
            Name: 'Peter Jakcson',
            Bio: 'Peter Jackson was born in New Zealand on October 31, 1961. As a child he enjoyed creating short films and then went on to direct a number of very successful film with no formal training.',
        },
    },
    {
        Title: 'Saving Private Ryan',
        Description: 'During World War Two, a squad of soldiers is sent to locate Pvt. James Ryan and bring him home after his three brothers were killed in action.',
        Genre: {
            Name: 'Thriller',
            Description: 'Thriller is an intense genre that leaves the audience on the edge of their seat in anticipation of what will happen next.',
        },
        Director: {
            Name: 'Steven Spielberg',
            Bio: 'Steven Spielberg is an American film director born, December 18, 1946. He has made a wide range of movies and won many different awards with his first coming at a film festival when he was only as teenager.',
        },
    },
    {
        Title: 'Interstellar',
        Description: 'A team of scientist and astonauts is sent through a wormhole to another solar sytem to find habitable planets for all of Humanity.',
        Genre: {
            Name: 'Thriller',
            Description: 'Thriller is an intense genre that leaves the audience on the edge of their seat in anticipation of what will happen next.',
        },
        Director: {
            Name:'Christopher Nolan',
            Bio: 'Chistopher Nolan was born July 30, 1970 and soon began making short films with his fathers camera. His movies are often dark and gritty with an emphasis on in depth storytelling.',
        },
    },
    {
        Title: 'Django: Unchained',
        Description: 'Django is a slave who is freed by a bounty hunter who then teaches Django his trade and helps track down his wife in order to save her from her fate.',
        Genre: {
            Name: 'Thriller',
            Description: 'Thriller is an intense genre that leaves the audience on the edge of their seat in anticipation of what will happen next.',
        },
        Director: {
            Name: 'Quentin Tarantino',
            Bio: 'Quentin Tarantino was born on March 27, 1963 in Knoxville, Tennessee and then moved to Califoria at age four and has immersed himself in movies ever since. The movies he makes are often intense and quite violent with a dark tone and a rough edge to them.',
        },
    },
    {
        Title: 'The Departed',
        Description: 'This film follows the story of two cops who lead opposite lives while undercover for their respective orginazations.',
        Genre: {
            Name: 'Drama',
            Description: 'This genre is rich with storytelling and dialog but often lacks the violence and explosions of a thriller or adventure genre.',
        },
        Director: {
            Name:'Martin Scorsese',
            Bio: 'Martin Scorsese was born on Novemeber 17, 1962 in Queens, New York. He has a long list of highly acclaimed films that tend to be very dramatic with excellent actors.',
        },
    },
    {
        Title: 'The Dark Knight',
        Description: 'Batman/s Most famous villian, the Joker, runs amok among Gotham pushing Batman to go to great lengths to stop him and protect the people of Gotham.',
        Genre: {
            Name: 'Thriller',
            Description: 'Thriller is an intense genre that leaves the audience on the edge of their seat in anticipation of what will happen next.',
        },
        Director: {
            Name: 'Christopher Nolan',
            Bio: 'Chistopher Nolan was born July 30, 1970 and soon began making short films with his fathers camera. His movies are often thrilling and intense with an emphasis on in depth storytelling.',
        },
    },
    {
        Title: 'Kingdom of Heaven',
        Description: 'A man travels to Jerusalem during the Crusades in the hopes of finding forgiveness for his crimes. While fighting in Jerusalem he ends up meeting his king and his enemy and falling in love.',
        Genre: {
            Name: 'Drama',
            Description: 'This genre is rich with storytelling and dialog but often lacks the violence and explosions of a thriller or adventure genre.',
        },
        Director: {
            Name: 'Ridley Scott',
            Bio: 'Ridely Scott is an English Filmaker who was born on November 30, 1937. He is known best for his science fiction and historical drama films with an excellent foundation on his ability to tell stories.',
        },
    },
    {
        Title: 'Shawshank Redemption',
        Description: 'After being accused of murdering his wife a man is sent to Shawshank Prison where he forms a friednship with another inmate until he eventually breaks out and reclaims his freedom.',
        Genre: {
            Name: 'Drama',
            Description: 'This genre is rich with storytelling and dialog but often lacks the violence and explosions of a thriller or adventure genre.',
        },
        Director: {
            Name: 'Frank Darabont',
            Bio: 'Frank Darabont was born in refugee camp on January 28, 1959 but moved to the United States while still a small child. He was inspired by George Lucas and pursued filmaking after seeing one of his early films.'
        },
    }
]

app.use(morgan('combined', {stream: accessLogStream}));
app.use(express.static('public'));

// CREATE, allow user to register
app.post('/users', (req, res) =>{
    const newUser = req.body;
    if (newUser.name){
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    }else{
        res.status(400).send('users need names');
    }
});

//CREATE, allow user to add movie to their list
app.post('/users/:id/:movieTitle', (req, res) =>{
    const { id, movieTitle } = req.params
   
    let user = users.find(user => user.id == id );

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    }else{
        res.status(400).send('no such user')
    }
});


//DELETE, allow user to remove movie from their list
app.delete('/users/:id/:movieTitle', (req, res) =>{
    const { id, movieTitle } = req.params
   
    let user = users.find(user => user.id == id );

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    }else{
        res.status(400).send('no such user')
    }
});

//DELTE, allow user to deregister
app.delete('/users/:id', (req, res) =>{
    const { id } = req.params
   
    let user = users.find(user => user.id == id );

    if (user) {
        users = users.filter(user => user.id != id);
        res.status(200).send(`user ${id} has been deleted`);
    }else{
        res.status(400).send('no such user')
    }
});

//UPDATE, allow user to update username
app.put('/users/:id', (req, res) =>{
    const { id } = req.params
    const updatedUser= req.body
   
    let user = users.find(user => user.id == id );

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    }else{
        res.status(400).send('no such user')
    }
});



//READ, return a list of all movies
app.get('/movies', (req, res)=> {
    res.status(200).json(movies);
});

//READ, return a single movie by title
app.get('/movies/:title', (req, res)=> {
    const { title } = req.params;
    const movie = movies.find(movie => movie.Title === title);

    if (movie) {
        res.status(200).json(movie);
    }else{
        res.status(400).send('no such movie')
    }
});

//READ, return data about genre by name
app.get('/movies/genre/:genreName', (req, res)=> {
    const { genreName } = req.params;
    const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

    if (genre) {
        res.status(200).json(genre);
    }else{
        res.status(400).send('no such genre')
    }
});


//READ, return data about director by name
app.get('/movies/directors/:directorName', (req, res)=> {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.Director.Name === directorName).Director;

    if (director) {
        res.status(200).json(director);
    }else{
        res.status(400).send('no such director')
    }
});

app.get('/', (req, res) =>{
    res.send('Welcome to my Top Movie Flix')
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something Broke!');
});

app.listen(8080, () =>{
    console.log('The movie app has loaded and is listening on port 8080');
});