const uuid = require('uuid');
const Sib = require('sib-api-v3-sdk');
const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');
const bcrypt = require('bcrypt');

exports.forgetpassword = async (req, res, next) => {
    console.log("okkkk==========>", req.body);
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        console.log(`user==========>`,user);

        if (user) {
            const id = uuid.v4();
            user.createForgotpassword({
                id: id,
                isActive: true,
            })
            .catch(err => {
                throw new Error(err);
            })
            const client = Sib.ApiClient.instance;
            const apiKey = client.authentications['api-key'];
            apiKey.apiKey = process.env.API_KEY;
        
            console.log(process.env.API_KEY);
        
            const zuberEmailApi = new Sib.TransactionalEmailsApi();
            const sender = { email : process.env.email};
            
            const receivers = [ {
                email : req.body.email,
            } ]
            
            const response = await zuberEmailApi
            .sendTransacEmail({
                sender,
                to: receivers,
                subject: "Forgot Password",
                textContent: "Reset password mail by Expence tracker",
                htmlContent: `
                <a href="http://100.26.211.77:3000/password/resetpassword/${id}">Reset password</a>
                `,
            })
        
            console.log(response);
        
            res.status(200).json({success : true , message: 'Link to reset password sent to your mail !'});
            } else {
                throw new Error('User not exist');
            }
    } catch (err) {
        console.error(err);
        return res.json({ message: err, sucess: false });
    }
}


exports.resetpassword = (req, res) => {
    const id = req.params.id;
    console.log('-----------------------------------------------------------');
    Forgotpassword.findOne({ where: { id: id } })
    .then(forgotpasswordrequest => {
        if(!forgotpasswordrequest){
            return  res.status(404).send(`<html> <h1>Something went wrong !</h1> </html>`)
        }
        if (forgotpasswordrequest.isActive) {
            forgotpasswordrequest.update({ isActive: false });
            res.status(200).send(`<html>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password"></input>
                                        <button>Reset Password</button>
                                    </form>
                                </html>`
            )
        }else if(!forgotpasswordrequest.isActive){
            return res.status(500).send(`<html>
                                    <h1>Link expired !</h1>
                                    <h2>Go back and generate another link.</h2>
                                </html>`
            )
        }else{
            return res.status(404).send(`<html>
                                    <h1>Something went wrong !</h1>
                                </html>`
            )
        }
    })
}

exports.updatepassword = async (req, res, next) => {
    console.log('update password================================>');
    
    const { newpassword } = req.query;
    // console.log(`newpassword ====` , newpassword);
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
                bcrypt.hash(newpassword , salt , (err, hash) => {
                    if(err){
                        console.log(err);
                        throw new Error(err);
                    }
                    user.update({password : hash})
                    .then(() => {
                        return res.redirect('http://100.26.211.77:3000/login.html');
                        // return res.status(201).json({success : true, message: 'Successfully updated new password'});
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