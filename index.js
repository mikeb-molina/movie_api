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

mongoose.connect( process.env.CONNECTION_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});


const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'),{flags:'a'});
const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'https://mikes-movie-flix-5278ac249606.herokuapp.com/'];
app.use(cors());
    
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

app.use(morgan('combined', {stream: accessLogStream}));
app.use(express.static('public'));


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
    let hashedPassword = Users.hashPassword(req.body.Password);
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

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});