const jwt = require('jsonwebtoken');

exports.loginRequired = async (req,res,next)=> {
    try{
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
            if(decoded)
                return next();
            else{
                return next({
                    status: 400,
                    message: "Login Required"
                });
            }
            
        });
    }catch(err){
        console.log(err);
        return next({
            status: 400,
            message: "Login Required"
        });
    }
}

exports.ensureCorrectUser = async (req,res,next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
            if(err){
                console.log(err);
                return next({
                    status: 400,
                    message: "Unauthorised"
                });
            }else{
                if(decoded && decoded.id === req.params.id && decoded.activated){
                    return next();
                }else{
                    return next({
                        status: 400,
                        message: "Unauthorised"
                    });
                }
            }
        });
    }catch(err){
        console.log(err);
        return next({
            status: 400,
            message: "Unauthorised"
        });
    }
}