const nodeMailer = require('nodemailer');

exports.sendMail = (email, token) => {
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
        text: `Click on this link to activate your account http://localhost:3000/api/auth/verify/?id=${token}. Then login with password again`       
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.sendResetMail = (email, token) => {
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
        text: `Click on this link to update password http://localhost:3000/api/auth/reset/?id=${token}.`       
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}