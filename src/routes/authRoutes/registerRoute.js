const register = require("express").Router()
const users = require("../../models/usersModel")
let sr = require("../../others/sendReturn")
const mongoose = require("mongoose")
let bodyParser = require("body-parser")

register.post("/register", (req, res) => {
  const users = require("../../models/usersModel")

  users.find({ email: req.body.email }, function(error, doc) {
    if (err) {
      console.log(err)
    } else {
      if (docs.length == 1)
        sr.sendReturn(res, 200, {
          error: false,
          message: "User exists"
        })
      else
        sr.sendReturn(res, 200, {
          error: false,
          message: "User doesn't exists"
        })
    }
  })

  let user = new users({
    email: req.body.email,
    password: req.body.password,
    temporary_password: req.body.temporary_password
  })
  user.save()
  res.send(user)
})

module.exports = register
