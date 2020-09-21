const mongoose = require('mongoose');

mongoose.connect(process.env.dbURI,{
    useUnifiedTopology: true,
    keepAlive: true,
    useFindAndModify: true
});

module.exports.User = require('./user');
module.exports.Url = require('./url');