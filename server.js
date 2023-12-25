const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs')

const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'Ps@080103Ba@0709',
      database : 'smartBrain'
    }
  });

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    return db.select('*').from('users')
    .then(user => {
        res.json(user)
    })
    .catch(console.log)
})

app.post('/signin', signin.handleSignIn(db, bcrypt));

app.post('/register', register.handleRegister(db, bcrypt));

app.get('/profile/:id', profile.handleProfile(db));

app.put('/image', image.handleImage(db));

app.post('/imageurl', (req, res) => {image.handleApi(req, res)});

app.listen(3001, () => {
    console.log('App is running on the port 3001');
})

/*
/ --> res: Yeahh! This is working!
/signin --> POST: sucess/fail
/register --> POST: user
/profile/:userid --> GET: user
/image --> PUT: user

*/