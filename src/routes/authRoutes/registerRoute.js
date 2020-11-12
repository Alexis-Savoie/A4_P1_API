const register = require("express").Router()
const users = require("../../models/usersModel")
let sr = require("../../others/sendReturn")
const mongoose = require("mongoose")
let bodyParser = require("body-parser")

register.post("/register", (req, res) => {
  const users = require("../../models/usersModel")

  users.find({ email: req.body.email }, function(error, results) {
    if (error) {
      console.log(error)
    } else {
      if (results.length == 1)
        sr.sendReturn(res, 200, {
          error: false,
          message: "User exists"
        })
      else {
        let user = new users({
          email: req.body.email,
          password: req.body.password
        })
        user.save()
        sr.sendReturn(res, 200, {
          error: false,
          message: "User succefully created "
        })
      }
    }
  })
})

module.exports = register
