const db = require('../models/index');
const jwt = require('jsonwebtoken');
const randomString = require('randomstring');
const nodeMailer = require('nodemailer');

exports.signup = async (req,res,next) => {
    try{
        let user = await db.User.create({
            email: req.body.email,
            password: req.body.password
        });
        let {id,email} = user;
        let token = jwt.sign({
            id,
            email
        },process.env.SECRET_KEY);
        return res.status(200).json({
            id,
            email,
            token
        });
    }catch(err){
        return next(err);
    }
}

exports.signin = async (req,res,next) => {
    try{
        let {email,password} = req.body;
        let user = await db.User.findOne({email});
        if(!user){
            return next({message: "Email not found"});
        }
        let isMatch = await user.comparePassword(password);
        if(isMatch){
            let {id} = user;
            let token = jwt.sign({
                id,
                email
            },process.env.SECRET_KEY);
            return res.status(200).json({
                id,
                email,
                token
            });
        }else{
            res.status(400).json({message: "Invalid password or email"});
        }
    }catch(err){
        return next(err);
    }
}

exports.resetPassword = async (req,res,next)=>{
    try{
        let {email} = req.body;
        let user = await db.User.findOne({email});
        if(!user)
            return res.status(404).json({message: "Email id not found"});
        let tempPassword = randomString.generate();
        user.password = tempPassword;
        await user.save();

        let transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        let mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset for URL Shortener',
            text: `This is you temporary password ${tempPassword}. Please login with this and reset your password`       
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });

        return res.status(200).json(user);
    }catch(err){
        console.log(err);
        return next(err);
    }
}

exports.updatePassword = async (req,res,next) => {
    try{
        let {email,password,newPassword}  = req.body;
        let user = await db.User.findOne({email});
        if(!user)
            return res.status(404).json({message: "Email id not found"});
        let isMatch = await user.comparePassword(password);
        if(isMatch){
            user.password = newPassword;
            user = await user.save();
            return res.status(200).json(user);
        }
        res.status(400).json({
            message: "Enter your temporary password correctly"
        })
    }catch(err){
        console.log(err);
        return next(err);
    }
}