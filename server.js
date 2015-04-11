var express = require('express');
var session = require('express-session');
var app = express();
var mongoose = require('mongoose');
var Sound = require('./models/Sound.js');
var User = require('./models/User.js');
var Video = require('./models/Video.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flow = require('./flowjs/flow')('tmp');
var multipart = require('connect-multiparty');
var Grid = require('gridfs-stream');


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/sounds');

var gfs = Grid(mongoose.connection.db, mongoose.mongo);

var bodyParser = require('body-parser');


app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.use(session({ secret: 'olhosvermelhoseasehjfussica' }));
app.use(passport.initialize());
app.use(passport.session());

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

app.get('/user', function(req, res, next){
    console.log('I received a request for the user ');
    res.json(req.user);
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
    console.log(res.body);
});

app.post('/logout', function(req, res, next){
    req.logout();
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

//app.post('/upload-profile-pic', function(req, res){
//    console.log('profile pic uploaded');
//    res.send(200);
//    console.log(res.body);
//});

var ACCESS_CONTROLL_ALLOW_ORIGIN = false;

// Handle uploads through Flow.js
app.post('/upload', multipart(), function(req, res) {
    if(!req.user) {
        return res.sendStatus(401);
    }

    flow.post(req, function(status, filename, original_filename, identifier) {
        console.log('POST', status, original_filename, identifier);

        if(status === 'done') {

            gfs.exist({
                filename: 'profile-' + req.user.username
            }, function (err, found) {
                if (err) return console.error(err);

                if(found) {
                    gfs.remove({
                        filename: 'profile-' + req.user.username
                    }, function (err) {
                        if (err) return console.error(err);
                        write();
                    });
                } else {
                    write();
                }



            });

            function write(){
                var writestream = gfs.createWriteStream({
                    filename: 'profile-' + req.user.username
                });

                flow.write(identifier, writestream);
            }


        }

        if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
            res.header("Access-Control-Allow-Origin", "*");
        }
        res.status(status).send();
    });
});


app.options('/upload', function(req, res){
    console.log('OPTIONS');
    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
        res.header("Access-Control-Allow-Origin", "*");
    }
    res.status(200).send();
});

// Handle status checks on chunks through Flow.js
app.get('/upload', function(req, res) {
    flow.get(req, function(status, filename, original_filename, identifier) {
        console.log('GET', status);
        if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
            res.header("Access-Control-Allow-Origin", "*");
        }

        if (status == 'found') {
            status = 200;
        } else {
            status = 404;
        }

        res.status(status).send();
    });
});

app.get('/profile-pic', function(req, res, next){
    if(!req.user) {
        return res.sendStatus(401);
    }

    gfs.exist({
        filename: 'profile-' + req.user.username
    }, function (err, found) {
        if (err) return console.error(err);

        if(found) {
            var readstream = gfs.createReadStream({
            filename: 'profile-' + req.user.username
        });
            readstream.pipe(res);

        } else {
            res.sendStatus(404);
        }



    });


});


app.listen(process.env.PORT || 3000);
console.log("Server running on port 3000");

