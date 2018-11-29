const express = require ('express');
const exphbs = require ('express-handlebars');
const mongoose = require('mongoose');

const app = express();


//Map global promise- get rid of warning
mongoose.Promise = global.Promise;
//connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
.then(()=> console.log('MongoDB Connected...'))
.catch(err=>console.log(err));

//Load Idea Model 
require('./models/Idea');
const Idea = mongoose.model('ideas');

//Handlebars Middleware

app.engine('handlebars', exphbs ({
    defaultLayout:'main'
}));
app.set('view engine', 'handlebars'); 

//How middleware works
// app.use(function(req,res,next){
//     console.log(Date.now());
//     req.name = "Shimrit Misgav";
//     next();
// })


//Index Route 
app.get('/', (req, res)=> {
    const title= "Welcome";
    res.render('index', {
        title:title
    });
});
//About Route
app.get('/about', (req,res)=> {
    res.render('about');
})

//Add Idea Form
app.get('/ideas/add', (req,res)=> {
    res.render('ideas/add');
})


const port = 5000;
app.listen(port, ()=> {
    console.log(`Server Started on port ${port}`);
    console.log('')
});