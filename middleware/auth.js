const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.authenticate = async (req, res, next) => {
    try{
        const token = req.header('Authorization');
        // console.log(`in authenticate page : token ===>` , token);
        const data = jwt.verify(token , process.env.secretKey)
        console.log(data);
        const user = await User.findByPk(data.id);
        // console.log(`user`, user);
        req.user = user;
        next();
    }catch(err){
        console.log(err);
    }
}

exports.againAuthenticate = async(req, res, next) => {
    try{
        const token = req.body.authorization;
        console.log(`token ===>` , token);
        const data = jwt.verify(token , process.env.secretKey)
        console.log(data);
        const user = await User.findByPk(data.id);
        // console.log(`user`, user);
        req.user = user;
        next();
    }catch(err){
        console.log(err);
    }
}