const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    }
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
        return next(err);
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