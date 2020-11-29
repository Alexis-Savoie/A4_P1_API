const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
let sr = require("../../others/sendReturn")
const users = require("../../models/usersModel")
const forgotPass = require("express").Router()

//#region change user password route
forgotPass.post("/sendTemporairePassword", (req, res) => {
  // check if an user is registered with this username
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
    // sendMail(user, info => {
    //   console.log("The mail has beed send 😃 ")
    //   res.send(info)
    // })


    // let testAccount = await nodemailer.createTestAccount()
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'joeltest047@gmail.com', // TODO: your gmail account
        pass: 'Test@!2020' // TODO: your gmail password
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
  //console.log(req.body)
})

module.exports = forgotPass
