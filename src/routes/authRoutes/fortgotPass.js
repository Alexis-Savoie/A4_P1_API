const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
// Local imports
let sr = require("../../others/sendReturn")
const users = require("../../models/usersModel")
const forgotPass = require("express").Router()

//#region change user password route
forgotPass.post("/sendTemporairePassword", (req, res) => {
  // check if an user is registered with this username
  const users = require("../../models/usersModel")
  let user = new users()
  //console.log(req.body)
  users.find({ email: req.body.email }, function(error, results) {
    if (error) {
      console.log(error)
    } else {
      if (results.length == 1)
        sr.sendReturn(res, 401, {
          error: false,
          message: "User already exists"
        })
    }

    let user = req.body
    sendMail(user, info => {
      console.log(`The mail has beed send 😃 and the id is ${info._id}`)
      res.send(info)
    })

    async function sendMail(user, callback) {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: users.email,
          pass: "hajaj12/?idjk"
        }
      })

      let mailOptions = {
        from: '"Fun Of Heuristic"<example.gimail.com>', // sender address
        to: users.email, // list of receivers
        subject: "Temporary password 👻" // Subject line
      }

      let info = transporter.sendMail(mailOptions)

      callback(info)
    }
  })
})

module.exports = forgotPass

// users.find({ email: req.body.email }, function(error, results) {
//   if (error) sr.sendReturn(res)
//   else {
//     // mongoDB error case
//     if (error) sr.sendReturn(res)
//     // if empty result
//     else if (results.length == 0)
//       sr.sendReturn(res, 401, {
//         error: true,
//         message: "Incorrect username/password"
//       })
//   }
// })
