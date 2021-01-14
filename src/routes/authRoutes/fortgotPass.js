const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt")
const config = require('config');

let sr = require("../../others/sendReturn")
const users = require("../../models/usersModel")
const forgotPass = require("express").Router()

forgotPass.post("/sendTemporaryPassword", (req, res) => {
<<<<<<< HEAD
=======


>>>>>>> 74c21362eaf4240128f5bb708a6ecdbec660eb52
    const users = require("../../models/usersModel")
    const sr = require("../../others/sendReturn")

    users.find({ email: req.body.email }).then(user => {
        if (!user)
            sr.sendReturn(res, 422, {
                error: false,
                message: "User dont exist with that email adress",
            })
        else {
            var generator = require('generate-password');
            var temporaryPassword = generator.generate({
                length: 10,
                numbers: true
            });
            const salt = bcrypt.genSaltSync(10)
            users.findOneAndUpdate({ email: req.body.email }, { temporary_password: bcrypt.hashSync(temporaryPassword, salt) }, { upsert: true }, function(error, doc) {
                if (error) sr.sendReturn(res)
                else {
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
<<<<<<< HEAD
                            user: config.get('Constants.emailResetPasswordEmail'),
                            pass: config.get('Constants.emailResetPasswordPassword')
=======
                            user: 'testjosav@gmail.com',
                            pass: config.get('Constants.emailPassword')

>>>>>>> 74c21362eaf4240128f5bb708a6ecdbec660eb52
                        }
                    });

                    let mailOptions = {
<<<<<<< HEAD
                        from: config.get('Constants.emailResetPasswordEmail'), // TODO: email sender
=======
                        from: 'testjosav@gmail.com', // TODO: email sender
>>>>>>> 74c21362eaf4240128f5bb708a6ecdbec660eb52
                        to: req.body.email, // TODO: email receiver
                        subject: "Mot de passe temporaire ProjetNodeAj 👻", // Subject line
                        text: "Voici votre mote de passe temporaire: " + temporaryPassword,
                    };

                    transporter.sendMail(mailOptions, function(err, data) {
                        if (err) {
                            console.log(err)
                            sr.sendReturn(res)
                        } else {
                            sr.sendReturn(res, 200, {
                                error: false,
                                message: "temporary password sended !",
                            })
                        }
                    })
                }
            })
        }
    })
})

module.exports = forgotPass