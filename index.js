const express = require('express'),
fs = require('fs'),
morgan = require('morgan'),
path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'),{flags:'a'});

let topTenMovies = [
    {
        Title: 'The Lord of the Rings: The Felloship of the Ring',
        Director: 'Peter Jackson' 

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