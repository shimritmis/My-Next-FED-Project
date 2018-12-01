const express = require ('express');
const exphbs = require ('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
// const MongoClient = require('mongodb').MongoClient;

const app = express();

// Load Routes
const ideas = require('./routes/ideas')

// Map global promise- get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', { useNewUrlParser: true })
.then(()=> console.log('MongoDB Connected...'))
.catch(err=>console.log(err));

// MongoClient.connect("mongodb://localhost:5000", { useNewUrlParser: true })

// Load Idea Model 
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars Middleware
app.engine('handlebars', exphbs ({
    defaultLayout:'main'
}));
app.set('view engine', 'handlebars'); 

// Body parser middleware -access whatever submitted by req.body, for example- in order to get form values.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'))

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

app.use(flash()); 

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Index Route 
app.get('/', (req, res)=> { 
    const title= "Welcome";
    res.render('index', {
        title:title
    });
});

//About Route
app.get('/about', (req,res)=> {
    res.render('about');
});

// User Login Route
app.get('/users/login', (req, res) => {
    res.send('login');
});

// User Register Route
app.get('/users/register', (req, res) => {
    res.send('register');
});

// Use Routes
app.use('/ideas', ideas);

const port = 5000;

app.listen(port, () => {
    console.log(`Server Started on port ${port}`);
    console.log('');
});