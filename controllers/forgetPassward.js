const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.forgetPassward = (req, res, next) => {
    // console.log("okkkk", req.body);

    const msg = {
        to: req.body.email, // Change to your recipient
        from: 'zuberahmad8960@gmail.com', // Change to your verified sender
        subject: 'for Practice',
        text: 'and easy to do anywhere, even with Node.js'
    }
    console.log("massage ===>",msg);

    sgMail
        .send(msg)
        .then((response) => {
            // console.log(response[0].statusCode)
            // console.log(response[0].headers);
            console.log(response);
            return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})
        })
        .catch((error) => {
            console.log(error)
        })

}