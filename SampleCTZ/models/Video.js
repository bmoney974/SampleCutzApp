var mongoose = require('mongoose');

var videoSchema = mongoose.Schema({
    "name" : String,
    "category" : String,
    "thumbnail_link" : String,
    "video_link" : String,
    "age" : Number,
    "description" : String
});

module.exports = mongoose.model('Video', videoSchema);