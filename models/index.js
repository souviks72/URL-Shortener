const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/reset1',{
    useUnifiedTopology: true,
    keepAlive: true,
    useFindAndModify: true
});

module.exports.User = require('./user');
module.exports.Url = require('./url');