var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Sound = require('./models/Sound.js');
var User = require('./models/User.js');
var Video = require('./models/Video.js');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/sounds');


var bodyParser = require('body-parser');



app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(passport.initialize());

app.get('/video/:id', function(req, res, next){
    console.log('I received a request for videos');
    var id = req.params.id;

    Video.where({_id:id})
        .findOne(function(err, doc){
            console.log(doc);
            res.json(doc);

        });
});

app.get('/videos', function(req, res){
    console.log('I received a request for videos');
    Video.find(function(err, docs){
        console.log(docs);
        res.json(docs);
    });
});



app.get('/users', function(req, res){
    console.log('I received a request for the users');
    User.find(function(err, docs){
        console.log(docs);
        res.json(docs);
    });
});

// get data from database
app.get('/sounds', function(req, res) {
    //console.log("I received a get request");

    Sound.find(function(err, docs){
        //console.log(docs);
        res.json(docs);
    });

});




//register user
app.post('/users', function(req, res){
    console.log(req.body);
    var user = new User(req.body);

    user.setPassword(req.body.password, function () {
        user.save(function(){
            res.sendStatus(200);
        });
    });


});

app.post('/login', passport.authenticate('local'), function(req, res){
    res.send(200);
});


//app.post('/users',function(req,res){
//    var user_name=req.body.username;
//    var email=req.body.email;
//    var password=req.body.password;
//    console.log("User name = "+user_name+", password is " +password + "email is " + email);
//    res.end("yes");
//
//});

// delete data from database

app.delete('/sounds/:id', function(req, res){
   var id = req.params.id;
    console.log(id);
    db.contactlist.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
       res.json(doc);
    });
});




app.put('/sounds/:id', function(req, res){
   var id = req.params.id;
    console.log(req.body.name);
    db.contactlist.findAndModify({query: {_id: mongojs.ObjectId(id)},
        update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number}},
        new: true}, function(err, doc){
        res.json(doc);

    });
});


app.listen(3000);
console.log("Server running on port 3000");

