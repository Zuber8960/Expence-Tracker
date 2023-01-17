const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const User = require('../models/user');
const Forgotpassword = require('../models/forgotPassward');
const bcrypt = require('bcrypt');

exports.forgetPassward = async (req, res, next) => {
    // console.log("okkkk", req.body);
    try {
        const user = await User.findOne({ where: { email: req.body.email } });

        if (user) {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);

            const id = uuid.v4();
            user.createForgotpassward({
                id: id,
                isActive: true,
            })
                .catch(err => {
                    throw new Error(err)
                })

            const msg = {
                to: user.email, // Change to your recipient
                from: process.env.email, // Change to your verified sender
                subject: 'for Practice',
                text: 'and easy to do anywhere, even with Node.js',
                html: `<a href="http://localhost:3000/passward/resetpassward/${id}">Reset password</a>`
            }
            console.log("massage ===>", msg);
            console.log(`check this link for reset passward =======> ${msg.html}`);

            sgMail
                .send(msg)
                .then((response) => {
                    console.log("okkkk ------------------------->");
                    // console.log(response[0].statusCode)
                    // console.log(response[0].headers);
                    // console.log(response);
                    return res.status(response[0].statusCode).json({ message: 'Link to reset password sent to your mail ', sucess: true })
                })
                .catch((error) => {
                    console.log(error)
                })

        } else {
            throw new Error('User not exist');
        }
    } catch (err) {
        console.error(err);
        return res.json({ message: err, sucess: false });
    }
}


exports.resetPassward = (req, res) => {
    const id = req.params.id;
    // console.log('-----------------------------------------------------------');
    Forgotpassword.findOne({ where: { id: id } }).then(forgotpasswordrequest => {
        if (forgotpasswordrequest) {
            forgotpasswordrequest.update({ isActive: false });
            res.status(200).send(`<html>
                                    <form action="/passward/updatepassward/${id}" method="get">
                                        <label for="newpassward">Enter New password</label>
                                        <input name="newpassward" type="password"></input>
                                        <button>Reset Password</button>
                                    </form>
                                </html>`
            );
            res.end();

        }
    })
}

exports.updatePassward = async (req, res, next) => {
    console.log('update passward================================>');
    
    const { newpassward } = req.query;
    // console.log(`newpassward ====` , newpassward);
    const id = req.params.id;
    try {
        const data = await Forgotpassword.findOne({ where: { id: id } })
        // console.log(data);
        const user = await User.findOne({ where: { id: data.userId } });
        if (user) {
            console.log(`email===>`, user.email);
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, (err, salt) => {
                if(err){
                    console.log(err);
                    throw new Error(err);
                }
                bcrypt.hash(newpassward , salt , (err, hash) => {
                    if(err){
                        console.log(err);
                        throw new Error(err);
                    }
                    user.update({passward : hash})
                    .then(() => {
                        return res.status(201).json({success : true, message: 'Successfully updated new Passward'});
                    })
                })
            })
        }else{
            return res.status(400).json({success : false , error : `No user exist`})
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({success : false , error : err})
    }
}