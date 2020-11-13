// External packages
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")

// Local imports
let sr = require("../../others/sendReturn")
const users = require("../../models/usersModel")

// For export
const resetPass = require("express").Router()

resetPass.post("/reset-password", function(req, res) {
  const email = req.body.email
  users
    .findOne({
      where: { email: email } //checking if the email address sent by client is present in the db(valid)
    })
    .then(function(user) {
      if (!users) {
        return throwFailed(res, "No user found with that email address.")
      }
      ResetPassword.findOne({
        where: { userId: users._id, status: 0 }
      }).then(function(resetPassword) {
        if (resetPassword)
          resetPassword.destroy({
            where: {
              id: resetPassword._id
            }
          })
        token = crypto.randomBytes(32).toString("hex") //creating the token to be sent to the forgot password form (react)
        bcrypt.hash(token, null, null, function(err, hash) {
          //hashing the password to store in the db node.js
          ResetPassword.create({
            userId: users._id,
            resetPasswordToken: hash,
            expire: moment.utc().add(config.tokenExpiry, "seconds")
          }).then(function(item) {
            if (!item) return throwFailed(res, "Oops problem in creating new password record")
            let mailOptions = {
              from: '"<jyothi pitta>" jyothi.pitta@ktree.us',
              to: user.email,
              subject: "Reset your account password",
              html: "<h4><b>Reset Password</b></h4>" + "<p>To reset your password, complete this form:</p>" + "<a href=" + config.clientUrl + "reset/" + user.id + "/" + token + '">' + config.clientUrl + "reset/" + user.id + "/" + token + "</a>" + "<br><br>" + "<p>--Team</p>"
            }
            let mailSent = sendMail(mailOptions) //sending mail to the user where he can reset password.User id and the token generated are sent as params in a link
            if (mailSent) {
              return res.json({ success: true, message: "Check your mail to reset your password." })
            } else {
              return throwFailed(error, "Unable to send email.")
            }
          })
        })
      })
    })
})

module.exports = resetPass
