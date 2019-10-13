const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const CarController = require('./controllers/car');
const UserController = require('./controllers/user');

app.use('/car', CarController);
app.use('/user', UserController);

// mongoose.connect('mongodb://localhost:27017/whitepandatask', (err) => {
//     if(err) {
//         console.error(err);
//         process.exit(1);
//     }
// });
mongoose.connect('mongodb+srv://admin:admin@cluster0-vmu9i.mongodb.net/whitepandatask?retryWrites=true&w=majority', (err) => {
    if(err) {
        console.error(err);
        process.exit(1);
    }
});
app.listen(3000);