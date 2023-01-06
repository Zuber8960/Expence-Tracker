const User = require('../models/user');

exports.signUp = (req, res, next) => {
    const data = req.body;
    // console.log(data);
    User.create({
        name : data.name,
        email: data.email,
        passward: data.passward
    })
    .then(user => {
        // console.log(`user ==>`, user);
        res.status(201).json({user});
    })
    .catch(err => { 
        console.log(err);
        res.status(400).json({error : err});
    })
}