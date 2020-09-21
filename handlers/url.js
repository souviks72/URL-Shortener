const validUrl = require('valid-url');
const shortid = require('shortid');

const db = require('../models/');

exports.shortenUrl = async (req,res,next) => {
    try{
        const {longUrl} = req.body;
        const baseUrl = process.env.BASE_URL;
        const userId = req.params.id;
        if(!validUrl.isUri(baseUrl)){
            return res.status(401).json('Invalid base url');
        }

        const urlCode = shortid.generate();

        if(validUrl.isUri(longUrl)){
            try{
                let url  = await db.Url.findOne({longUrl});
                if(url){
                    return res.status(200).json(url);
                }else{
                    const shortUrl = baseUrl + '/' + urlCode;
                    let newUrl = new db.Url({
                        longUrl,
                        shortUrl,
                        urlCode,
                        user: userId                        
                    });
                    newUrl = await newUrl.save();
                    let user = await db.User.findById(userId);
                    console.log(user);
                    user.urls.push(newUrl.id);
                    await user.save();
                    return res.status(200).json(newUrl);
                }
            }catch(err){
                console.log(err);
                return next({
                    status: 500,
                    message: "Cannot shorten url"
                });
            }
        }else{
            return res.status(400).json("Enter a valid url");
        }
    }catch(err){
        console.log(err);
        return next({
            status: 500,
            message: "Cannot shorten url"
        });
    }
}

exports.visitUrl = async (req,res,next) =>{
    try{
        let url = await db.Url.findOne({urlCode: req.params.code});
        console.log(url);
        if(url){
            let visited = url.visited+1;
            await db.Url.findByIdAndUpdate(url.id,{visited});
            res.redirect(url.longUrl);
        }else{
            res.status(400).json("Invalid code");
        }
    }catch(err){
        console.log(err);
        return res.status(500).json("Cannot get url");
    }
}

exports.getUrls = async (req,res,next) => {
    try{
        let userid = req.params.id;
        console.log(userid);
        let urls = await db.Url.find({user: userid});
        console.log(urls);
        return res.status(200).json(urls);
    }catch(err){
        console.log(err);
        return res.status(500).json("Cannot get urls");
    }
}