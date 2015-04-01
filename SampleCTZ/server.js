var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Sound = require('./models/Sound.js');

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/sounds');

var bodyParser = require('body-parser');



app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());


app.get('/videos', function(req, res){
    console.log('I received a request for videos');
    db.videos.find(function(err, docs){
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




//send data to the database
app.post('/sounds', function(req, res){
    console.log(req.body);
    db.contactlist.insert(req.body, function(err, doc){
        res.json(doc);
    })
});

// delete data from database

app.delete('/sounds/:id', function(req, res){
   var id = req.params.id;
    console.log(id);
    db.contactlist.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
       res.json(doc);
    });
});


app.get('/sounds/:id', function(req, res){
   var id = req.params.id;
    console.log(id);
    db.contactlist.findOne({_id: mongojs.ObjectId(id)}, function(err, doc){
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

