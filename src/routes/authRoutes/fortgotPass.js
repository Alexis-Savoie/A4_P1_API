const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
let sr = require("../../others/sendReturn")
const users = require("../../models/usersModel")
const forgotPass = require("express").Router()

//#region change user password route
forgotPass.post("/sendTemporairePassword", async (req, res) => {
  const user = req.body.email
  // check if an user is registered with this username
  const users = require("../../models/usersModel")
  const sr = require("../../others/sendReturn")
  const salt = bcrypt.genSaltSync(10)
  users.findOneAndUpdate({ email: req.body.email }, { temporary_password: bcrypt.hashSync("ZAKl1@6AJS43714GZ/", salt) }, { upsert: true }, function (err, doc) {
    if (err) sr.sendReturn(res)
    else
      sr.sendReturn(res, 200, {
        error: false,
        message: "login successful",
        email: users.email
      })
  })


  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'lue56@ethereal.email',
      pass: '2n53Ds3UJZ8DVXGk87'
    },

    tls: {
      rejectUnauthorized: false
    }
  });

  const msg = {
    from: '"Fred Foo 👻" <lue56@ethereal.email>', // sender address
    to: users.email, // list of receivers
    subject: "Voici votre mot de passe temporaire", // Subject line
    text: "ZAKl1@6AJS43714GZ/", // plain text body

  }
  // send mail with defined transport object
  let info = await transporter.sendMail(msg);

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  res.send("Email sent")



})

module.exports = forgotPass
