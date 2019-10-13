const { Router } = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const User = require('../models/user');
const {authenticate} = require('./middleware/auth');
const router = Router();

// router.post('/signup', (req, res) => {
//     let { name, email, password } = req.body;
//     password = bcrypt.hashSync(password, 7);
//     User.create({ name, email, password }, (err, doc) => {
//         if (err && err.name === 'MongoError' && err.code === 11000) {
//             return res.status(409).json({ error: true, message: 'User with this email already exists' });
//         }
//         if (err) {
//             return res.status(500).json({ error: true, message: 'Internal server error' });
//         }
//         return res.status(200).json({ error: false, message: 'User created successfully'});
//     });
// });

// router.post('/login', (req, res) => {
//     const { email, password } = req.body;
//     User.findOne({ email }, { password: 1, email: 1 }, (err, doc) => {
//         if (err) {
//             return res.status(500).json({ error: true, message: 'Internal server error' });
//         }
//         if (!bcrypt.compareSync(password, doc.password)) {
//             return res.status(401).json({ error: true, message: 'Invalid email/password' });
//         }
//         return res.status(200).json({ error: false, message: 'LoggedIn' });
//     });
// });

// Sign up route
router.post('/signup',(req,res) => {
    var body = _.pick(req.body , ['name' , 'email' , 'password']);
    var user = new User(body);
    user.save().then(()=>{
      return user.generateAuthToken();
    }).then((token) =>{
      res.header('x-auth' , token).send(user);
    }).catch((e) => {
      console.log(e);
      res.status(400).send(e);
    })
  });
  
  // Login routes
  router.post('/login',(req,res) => {
    var body = _.pick(req.body , ['email' , 'password']);
    User.findByCredentials(body.email,body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.cookie('token' , token).send(user);
      });
    }).catch((e) => {
      res.status(400).send(e);
    });
  });

module.exports = router;