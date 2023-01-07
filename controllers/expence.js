const User = require('../models/user');

exports.signUp = (req, res, next) => {
    const data = req.body;
    // console.log(data);
    if (data.name == "" || data.email == "" || data.passward == "") {
        // console.log(`name`);
        return res.status(200).json({message : "Please fill all feilds !"} )
    }
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
        console.log(`error ==>`, err.errors[0].message);
        if(err.errors[0].message == 'email must be unique'){
            console.log('ok', err.errors[0].value);
            return res.status(500).json({message : `email: ${err.errors[0].value} is already exist`});
        }
        res.status(400).json({error : err});
    })
}

exports.login = (req, res, next) => {
    let email = req.body.email;
    let passward = req.body.passward;
    if(email == "" || passward == ""){
        return res.status(201).json({message : `Please fill all feilds !`, error : 'Something went wrong.'});
    }
    console.log(email,passward);
    User.findAll({ where : { email : email}})
    .then(user => {
        if(user.length == 0){
            return res.status(404).json({message : `Error(404) : User ${email} does not exist`});
        }else{
            if (user[0].passward == passward){
                return res.status(201).json({message : `User : ${user[0].name} logged in successfully.`});
            }else {
                return res.status(401).json({message : `Error(401) : User not authorized !` });
            }
        }
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({error : err});
    });
}