const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');

exports.signUp = (req, res, next) => {
    const data = req.body;

    if (data.name == "" || data.email == "" || data.passward == "") {
        // console.log(`name`);
        return res.status(200).json({ message: "Please fill all feilds !" })
    }
    const saltRounds = 10;
    bcrypt.hash(data.passward, saltRounds, async (err, hash) => {
        try {
            console.log(err);
            const user = await User.create({
                name: data.name,
                email: data.email,
                isPremiumUser: false,
                passward: hash,
            })
            return res.status(201).json({ success: true, user })
        } catch (err) {
            if (err.errors[0].message == 'email must be unique') {
                console.log('email already exist', err.errors[0].value);
                return res.status(404).json({ success: false, message: `Eror(404) : ${err.errors[0].value} is already exist` });
            }
            console.log(`error ==>`, err);
            return res.status(400).json({ success: false, error: err });
        }
    })

}

function generateAccessToken(id, name) {
    return jwt.sign({ id: id, name: name }, process.env.secretKey);
}


exports.login = async (req, res, next) => {
    try {
        let email = req.body.email;
        let passward = req.body.passward;
        if (email == "" || passward == "") {
            return res.status(204).json({ success: false, message: `Please fill all feilds !` });
        }
        // console.log(email, passward);

        const user = await User.findAll({ where: { email: email } })

        if (user.length == 0) {
            return res.status(404).json({ success: false, message: `Error(404) : User ${email} does not exist` });
        } else {
            bcrypt.compare(passward, user[0].passward, (err, response) => {
                if (err) {
                    console.log(err);
                }
                if (response) {
                    return res.status(201).json({ success: true, message: `User : ${user[0].name} logged in successfully.`, token: generateAccessToken(user[0].id, user[0].name) });
                } else {
                    return res.status(401).json({ success: false, message: `Error(401) : Entered wrong passward !` });
                }
            })
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
    }
}

updloadToS3 = (data, filename) => {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3Bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })
    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject) => {
        s3Bucket.upload(params, (err, s3responce) => {
            if (err) {
                console.log(`Something went wrong`, err);
                reject(err);
            } else {
                console.log(`work has done ===>`, s3responce);
                resolve(s3responce.Location);
            }
        })
    })
}
const Filedownloaded = require('../models/filedownloaded');

exports.download = async (req, res, next) => {
    try {
        // console.log(`123` , req.user);
        const expences = await req.user.getExpences();
        // console.log(`abc` , expences);
        const stringifiedExpences = JSON.stringify(expences);
        const filename = `Expence-${req.user.id}/${new Date()}.txt`;
        const fileURL = await updloadToS3(stringifiedExpences, filename);

        // console.log(fileURL);
        await req.user.createFiledownloaded({
            fileURL: fileURL
        })
        return res.status(200).json({ fileURL, success: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, error: err });
    }
}

exports.getOldFiles = async (req, res, next) => {
    // console.log(`===========>`, req.user);
    try {
        const allFiles = await req.user.getFiledownloadeds();
        // console.log(result);
        return res.status(200).json({success : true, allFiles})
    } catch (err) {
        console.log(err);
        return res.status(400).json({success : false, error : err})
    }


}


