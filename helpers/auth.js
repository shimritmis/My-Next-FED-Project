module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Not Authorized');
        res.redirect('/users/login')
    }
}

/*
we'll add ensureAuthenticated to any route that we don't want our users to have access to, without loging in.

what routes do you want to protect? let's take ideas/add, for example. we'll go to idaes.js, we'll add {ensureAuthenticated} (destructuring), like that:
const {ensureAuthenticated} = require('../helpers/auth');
and than in our "Add Idea Form", we'll add ensureAuthenticated as a parameter. 
router.get('/add', ensureAuthenticated, (req,res)=> {
    res.render('ideas/add');
}); 

using those curly braces, we can take any function name that we want.
we can add another func after ensureAuthenticated, and use it too, like that (looke after the comma, in "somthingElse" func) 

module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Not Authorized');
        res.redirect('/users/login')
    }, 
    somethingElse: function....
}

than we can add somethingElse to our const, like that: const {ensureAuthenticated, somthingElse} = require('../helpers/auth'); and add somethingElse as a parameter to our function:
 router.get('/add', ensureAuthenticated, somethingElse (req,res)=> {
    res.render('ideas/add');

in ideas.js we'll add ensureAuthenticated to ideas route, edit route, process form route, edit form process route and delete idea route as well (basically, everything in ideas.js)
*/