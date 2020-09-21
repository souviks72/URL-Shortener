const db = require('../models/index');
const jwt = require('jsonwebtoken');
const randomString = require('randomstring');
const {sendMail, sendResetMail} = require('../utils');

exports.signup = async (req,res,next) => {
    try{
        let {email, fname, lname,password} = req.body;
        let user = await db.User.create({
            email,
            fname,
            lname,
            password
        });

        let token = jwt.sign({
            id: user._id
        },process.env.SECRET_KEY);
        sendMail(email,token);
        return res.status(200).json("Check your mail for activation link");
    }catch(err){
        console.log(err);
        return next({
            status: 400,
            message: "Error signing up user"
        })
    }
}

exports.verify = async (req,res,next) => {
    try{
        let token = req.params.id;
        let decodedId = jwt.verify(token, process.env.SECRET_KEY);
       
        let user = await db.User.findById(decodedId.id);
       
        if(!user){
            return res.status(404).json("User not found");
        }else{
            user = await db.User.findByIdAndUpdate(user.id, {activated: true},{new: true});
            let {email,fname,lname,activated} = user;
            return res.status(200).json({
                email,
                fname,
                lname,
                activated,
                token
            });
        }
        
    }catch(err){
        console.log(err);
        return next({
            status: 400,
            message: "Error verifying user"
        })
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
            let {id,activated} = user;
            let token = jwt.sign({
                id,
                activated
            },process.env.SECRET_KEY);
            return res.status(200).json({
                id,
                token
            });
        }else{
            res.status(400).json({message: "Invalid password or email"});
        }
    }catch(err){
        return next(err);
    }
}

exports.forgetPassword = async (req,res,next) => {
    try{
        let {email} = req.body;
        let user = await db.User.findOne({email});
        if(!user)
            return res.status(404).json("Email id not found");
        else{
            console.log(user);
            let token = jwt.sign({
                id: user._id
            },process.env.SECRET_KEY);

            sendResetMail(email,token);
            return res.status(200).json("Check your mail for activation link");
        }
        
    }catch(err){
        console.log(err);
        return next({
            status: 500,
            message: "Error sending reset mail"
        });
    }
}

exports.updatePassword = async (req,res,next) => {
    try{
        let token = req.params.id;
        let decodedId = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decodedId);
        let user = await db.User.findById(decodedId.id);
       
        if(!user){
            return res.status(404).json("User not found");
        }else{
            let password = req.body.password;
            if(!password)
                return res.status(200).json("Enter password field");
            user.password = password;
            await user.save();
            return res.status(200).json("password changed. login again");            
        }
        
    }catch(err){
        console.log(err);
        return next(err);
    }
}



// exports.resetPassword = async (req,res,next)=>{
//     try{
//         let {email} = req.body;
//         let user = await db.User.findOne({email});
//         if(!user)
//             return res.status(404).json({message: "Email id not found"});
//         let tempPassword = randomString.generate();
//         user.password = tempPassword;
//         await user.save();

//         let transporter = nodeMailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: process.env.EMAIL,
//                 pass: process.env.PASS
//             }
//         });

//         let mailOptions = {
//             from: process.env.EMAIL,
//             to: email,
//             subject: 'Password Reset for URL Shortener',
//             text: `This is you temporary password ${tempPassword}. Please login with this and reset your password`       
//         };

//         transporter.sendMail(mailOptions, function(error, info){
//             if (error) {
//               console.log(error);
//             } else {
//               console.log('Email sent: ' + info.response);
//             }
//         });

//         return res.status(200).json(user);
//     }catch(err){
//         console.log(err);
//         return next(err);
//     }
// }