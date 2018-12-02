const express = require ('express');
const path = require('path'); 
const exphbs = require ('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require ('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
// const MongoClient = require('mongodb').MongoClient;

const app = express();

// Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// DB Config 
const db = require('./config/database'); 

// Passport Config 
require('./config/passport')(passport); 

// Map global promise- get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect(db.mongoURI, { 
    useNewUrlParser: true
 })
    .then(()=> console.log('MongoDB Connected...'))
    .catch(err=>console.log(err));


// Load Idea Model - has been removed to ideas.js
// require('./models/Idea');
// const Idea = mongoose.model('ideas');

// Handlebars Middleware
app.engine('handlebars', exphbs ({
    defaultLayout:'main'
}));
app.set('view engine', 'handlebars'); 

// Body parser middleware -access whatever submitted by req.body, for example- in order to get form values.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder- sets the public folder to be the express static folder:
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'))

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Passport middleware- always after Express middleware
app.use(passport.initialize());
app.use(passport.session()); 

app.use(flash()); 

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null; 
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

// Use Routes
app.use('/ideas', ideas);
app.use('/users', users); 

const port =process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server Started on port ${port}`);
    console.log('');
});