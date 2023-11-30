const bodyParser = require('body-parser');
const express = require('express'),
fs = require('fs'),
morgan = require('morgan'),
path = require('path'),
uuid = require('uuid');


const app = express();

app.use(bodyParser.json());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'),{flags:'a'});

let topTenMovies = [
    {
        Title: 'The Lord of the Rings: The Felloship of the Ring',
        Description: 'Several Hobbits along with their companions set out on a quest to destroy the One ring.',
        Genre: {
            Name: 'Fantasy',
            Description: 'Is a genre of fiction that takes place in a world that follows different rules than our own.',
        },
        Director: {
            Name: 'Peter Jackson',
            Bio: 'Peter Jackson was born in New Zealand on October 31, 1961. As a child he enjoyed creating short films and then went  on to direct a number of very successful film with no formal training.',
        }
    },
    {
        Title: 'The Lord of the Rings: The Two Towers',
        Director: 'Peter Jackson'
    },
    {
        Title: 'The Lord of the Rings: The Return of the King',
        Director: 'Peter Jakcson'
    },
    {
        Title: 'Saving Private Ryan',
        Director: 'Steven Spielberg'
    },
    {
        Title: 'Intersteller',
        Director: 'Christopher Nolan'
    },
    {
        Title: 'Django: Unchained',
        Director: 'Quentin Tarantino'
    },
    {
        Title: 'The Departed',
        Director: 'Martin Scorsese'
    },
    {
        Title: 'The Dark Knight',
        Director: 'Christopher Nolan'
    },
    {
        Title: 'Kingdom of Heaven',
        Director: 'Ridley Scott'
    },
    {
        Title: 'Shawshank Redemption',
        Director: 'Frank Darabont'
    }
]

app.use(morgan('combined', {stream: accessLogStream}));
app.use(express.static('public'));

app.get('/movies', (req, res)=> {
    res.json(topTenMovies);
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