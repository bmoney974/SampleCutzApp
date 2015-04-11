var mongoose = require('mongoose');

var soundSchema = mongoose.Schema({
    "name" : String,
    "category" : String,
    "genre" : String,
    "bpm" : Number,
    "audio_link" : String,
    "file_name" : String
});

module.exports = mongoose.model('Sound', soundSchema);