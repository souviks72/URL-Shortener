const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Url = require('./url');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 32
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    activated: {
        type: Boolean,
        default: false
    },
    urls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Url"
    }]
});

userSchema.pre('save', async function(next){
    try{
        if(!this.isModified("password")){
            return next();
        }
        let hashedPassword = await bcrypt.hash(this.password,10);
        this.password = hashedPassword;
        return next();
    }catch(err){
        console.log("error hashing password");
        return next({
            status: 500,
            message: "Error hashing user's password"
        });
    }
});

userSchema.pre('remove', async function(next){
    try{
        this.urls.forEach(async url=>{
            await Message.findByIdAndDelete(url);
        })
    }catch(err){
        return next({
            status: 500,
            message: "Error removing deleted user's urls"
        });
    }
});

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        let isMatch = await bcrypt.compare(candidatePassword,this.password);

        return isMatch;
    }catch(err){
        console.log(err);
        return;
    }
}

const User = mongoose.model("User", userSchema);
module.exports = User;