// External packages
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")

// Local imports
let sr = require("../../others/sendReturn")
const users = require("../../models/usersModel")

// For export
const register = require("express").Router()


register.post("/register", (req, res) => {
  const users = require("../../models/usersModel")

  users.find({ email: req.body.email }, function(error, results) {
    if (error) {
      console.log(error)
    } else {
      if (results.length == 1)
        sr.sendReturn(res, 401, {
          error: false,
          message: "User already exists"
        })
      else {
        let user = new users({
          email: req.body.email,
          password: req.body.password,
          temporary_password: ""
        })
        const salt = bcrypt.genSaltSync(10)
        user.password = bcrypt.hashSync(user.password, salt)
        user.save()
        sr.sendReturn(res, 201, {
          error: false,
          message: "User succesfully created "
        })
      }
    }
  })
})

module.exports = register
