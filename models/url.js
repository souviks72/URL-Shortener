const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./user');

const urlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String
    },
    urlCode:{
        type: String
    },
    visited: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{
    timestamps: true
});

urlSchema.pre("remove", async function(next){
    try{
        let user = await User.findById(this.user);
        user.urls.remove(this.id);
        await user.save();
    }catch(err){
        return next(err);
    }
})

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;