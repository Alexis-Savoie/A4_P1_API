const nodemailer = require("nodemailer")
require('dotenv').config();
let sr = require("../../others/sendReturn")
const users = require("../../models/usersModel")
const forgotPass = require("express").Router()

forgotPass.post("/sendTemporairePassword", (req, res) => {

  const users = require("../../models/usersModel")
  const sr = require("../../others/sendReturn")

  users.findOneAndUpdate({ email: req.body.email }, { temporary_password: "ZAKl1@6AJS43714GZ/" }, { upsert: true }, function (error, doc) {
    if (error) sr.sendReturn(res)
    else
      sr.sendReturn(res, 200, {
        error: false,
        message: "login successful",

      })
  })



  users.find({ email: req.body.email }).then(user => {
    if (!user) {
      return res.status(422).json({ error: "User dont exist with that email adress" })
    }

    users.temporary_password = "ZAKl1@6AJS43714GZ/"

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });


    let mailOptions = {
      from: 'joeltest047@gmail.com', // TODO: email sender
      to: 'joeltest047@gmail.com', // TODO: email receiver
      subject: "Temporary password 👻", // Subject line
      text: "Voici votre mote de passe temporaire: ZAKl1@6AJS43714GZ/",
    };

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log(err)
      } else {
        console.log("Emeil sent!!!")
      }
    })


  })

})

module.exports = forgotPass
