const bodyParser = require('body-parser');
const express = require('express'),
fs = require('fs'),
morgan = require('morgan'),
path = require('path'),
uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');
const { check, validationResult} = require('express-validator');

const Movies= Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});



const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'),{flags:'a'});
const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
app.use(cors({
    origin: (origin, callback) => {
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){ //if specific origin isnt found on list of allowed origins
        let message = 'The CORS policy for this application doesnt allow access from origin ' + origin;
        return callback(new Error(message), false);
    }
    return callback(null, true);
    }
}));
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

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

// CREATE, add a user
/* json format
{
    ID: Integer,
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
}*/
app.post('/users',
    [
    check('Username', 'Username is required').isLength({min:5}),
    check('Username', 'Username contains non alphanumeric characters - notallowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
    ], async (req, res) =>{
        let errors = validationResult(req);

        if (!errors.isEmpty()){
            return res.status(422).json({errors: errors.array() });
        }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({Username: req.body.Username})
    .then((user) =>{
        if (user){
        return res.status(400).send(req.body.Username + ' already exists');
        } else {
            Users
            .create({
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
            .catch((error)=>{
                console.error(error);
                res.status(500).send('Error' + error);
            })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error' + error);
    });
});

// Get all users
app.get('/users', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Users.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error' + err);
    });
});

//Get single user by Username
app.get('/users/:Username', passport.authenticate('jwt', {session:false}), async (req, res)=> {
    if (req.user.Username !== req.params.Username) {
        return res.status(400).send("Permission denied");
      }
    await Users.findOne({Username: req.params.Username})
    .then((user) =>{
    res.json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' +err);
    });
});

//CREATE, allow user to add movie to their list
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), async (req, res) =>{
    let hashedPassword = Users.hashPassword(req.body.Password);
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate({ Username: req.params.Username},
        {
            $push: {FavoriteMovies: req.params.MovieID}
        },
        {new: true})
        .then((updateUser)=>{
            res.json(updateUser);
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error:' + err);
    });
});


//DELETE, allow user to remove movie from their list
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}),  async (req, res) =>{
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate({ Username: req.params.Username},
        {
            $pull: {FavoriteMovies: req.params.MovieID}
        },
        {new: true})
        .then((updateUser)=>{
            res.json(updateUser);
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error:' + err);
    });
});



//DELTE, Delete a user by Username
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), async (req, res) =>{
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndDelete({Username: req.params.Username})
        .then((user) =>{
            if(!user) {
                res.status(400).send(req.params.Username + ' was not found');
            }else {
                res.status(200).send(req.params.Username + ' was deleted');
            }
        })
        .catch((err) =>{
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


//UPDATE, allow user to update username
app.put('/users/:Username', passport.authenticate('jwt', {session: false}), async (req, res) =>{    
//Condition to check added here
    if(req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }
    //Condition Ends
    await Users.findOneAndUpdate({Username: req.params.Username},
        {$set:
            {
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
        },
        {new: true})
        .then((updateUser) => {
            res.json(updateUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' +err);
        })
});



//READ, return a list of all movies
app.get('/movies/', passport.authenticate('jwt', {session:false}), async (req, res)=> {
    await Movies.find()
    .then((movie) =>{
        res.status(201).json(movie);
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//READ, return a single movie by title
app.get('/movies/:Title', passport.authenticate('jwt', {session:false}), async (req, res)=> {
    await Movies.findOne({Title: req.params.Title})
    .then((movie) =>{
    res.json(movie);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' +err);
    });
});


//READ, return data about genre by name
app.get('/movies/genres/:genreName', passport.authenticate('jwt', {session:false}),  async (req, res)=> {
    await Movies.find({'Genre.Name': req.params.genreName})
    .then((movies) => {
        res.json(movies);
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//READ, return data about director by name
app.get('/movies/directors/:directorName', passport.authenticate('jwt', {session:false}), async (req, res)=> {
   await Movies.find({'Director.Name': req.params.directorName})
   .then((movies) =>{
   res.json(movies);
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
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