const express = require ('express');
const exphbs = require ('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
// const MongoClient = require('mongodb').MongoClient;

const app = express();

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

// Idea Index page
app.get('/ideas', (req,res)=> {
    Idea.find({})
    .sort({date:'desc'})
    .then(ideas => {
        res.render('ideas/index', {
            ideas:ideas
        });
    });
});

// Add Idea Form
app.get('/ideas/add', (req,res)=> {
    res.render('ideas/add');
});

// Edit Idea Form
app.get('/ideas/edit/:id', (req,res)=> {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea:idea
        });
    });
});

//Process Form
app.post('/ideas', (req,res)=> {
     let errors= [];
     if(!req.body.title) {
        errors.push({text:'Please add a title'}); 
     }
     if(!req.body.details) {
        errors.push({text:'Please add some details'}); 
     }
     if(errors.length > 0) {
         res.render('ideas/add', {
             errors: errors,
             title:req.body.title,
             details: req.body.details
         });
        } else {
            const newUser ={
                title: req.body.title,
                details:req.body.details
            }
            new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas');
            })
        }
});

// Edit Form process 
app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id:req.params.id
    })
    .then (idea => {
        //new values
        idea.title=req.body.title,
        idea.details =req.body.details;

        idea.save()
            .then(idea => {
                res.redirect('/ideas');
            })
    });
});

//Delete Idea
app.delete('/ideas/:id', (req, res)=> {
   Idea.deleteOne({_id: req.params.id})
    .then(() => {
    res.redirect('/ideas');
    });
});
const port = 5000;
app.listen(port, ()=> {
    console.log(`Server Started on port ${port}`);
    console.log('');
});