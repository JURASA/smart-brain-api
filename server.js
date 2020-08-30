const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const images = require('./controllers/images');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'test',
        database: 'facedetector'
    }
});

db.select('*').from('users')
    .then((data) => {
        console.log(data);
    });

const app = express();

//middle ware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    console.log('root route was requested');
    res.send(database.users);
});

//.json is essentially the same as .send but w/ more features

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)});
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});
app.put('/images', (req, res) => {images.handleImages(req, res, db)});
app.post('/imagesurl', (req, res) => {images.handleApiCall(req, res)});

app.listen(3001, ()=> {
    console.log('app is running on port 3001');
});

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user 
/profile/:userId --> GET = user
/image -> PUT --> user (count)

*/




