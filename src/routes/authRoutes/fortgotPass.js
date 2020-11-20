const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
// Local imports
let sr = require("../../others/sendReturn")
const users = require("../../models/usersModel")
const forgotPass = require("express").Router()

//#region change user password route
forgotPass.post("/sendTemporaryPassword", (req, res) => {
  // check if an user is registered with this username
  const users = require("../../models/usersModel")
  const sr = require("../../others/sendReturn")
  users.find({ email: req.body.email }).then(user => {
    if (!user) {
      return res.status(422).json({ error: "User dont exist with that email adress" })
    }

    user.temporary_password = "ZAKl1@6AJS43714GZ/"
    sendMail(user, info => {
      console.log("The mail has beed send 😃 ")
      res.send(info)
    })

    async function sendMail(user, callback) {
      // let testAccount = await nodemailer.createTestAccount()
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: user.email, // generated ethereal user
          pass: user.temporary_password // generated ethereal password
        }
      })

      let mailOptions = {
        from: '"Fun Of Heuristic"<example.gimail.com>', // sender address
        to: user.email, // list of receivers
        subject: "Temporary password 👻", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>" // html body
      }

      let info = transporter.sendMail(mailOptions)

      callback(info)
    }

    // transporter.sendMail({
    //   to: user.email,
    //   from: "no-replay@gmail.com",
    //   subject: "Mot de passe temporaire"
    // })
  })
  //console.log(req.body)
})

module.exports = forgotPass

// users.find({ email: req.body.email }, function(error, results) {
//   if (error) {
//     console.log(error)
//   } else {
//     if (results.length == 1)
//       sr.sendReturn(res, 401, {
//         error: false,
//         message: "User already exists"
//       })
//   }

//   let users = req.body
//   sendMail(users, info => {
//     console.log(`The mail has beed send 😃 and the email is ${info.email}`)
//     res.send(info)
//   })

//   async function sendMail(users, callback) {
//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false, // true for 465, false for other ports
//       auth: {
//         user: users.email,
//         pass: "hajaj12/?idjk"
//       }
//     })

//     let mailOptions = {
//       from: '"Fun Of Heuristic"<example.gimail.com>', // sender address
//       to: users.email, // list of receivers
//       subject: "Temporary password 👻" // Subject line
//     }

//     let info = transporter.sendMail(mailOptions)

//     callback(info)
//   }
// })
