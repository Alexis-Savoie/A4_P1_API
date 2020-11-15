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

register.get("/users", (req, res) => {
  // to see if req.user exists right after registration or login
  console.log("req.user", req.users)
  users
    .find()
    .sort({ createdOn: -1 })
    .exec()
    .then(Users => res.status(200).json(Users))
    .catch(err =>
      sr.sendReturn(res, 404, {
        error: false,
        message: "users not found - :("
      })
    )
})

register.get("/users/:id", (req, res) => {
  const id = req.params._id
  users
    .findById(id)
    .then(Users => res.status(200).json(Users))
    .catch(err =>
      sr.sendReturn(res, 404, {
        error: false,
        message: `User  with id ${id} not found`
      })
    )
})

module.exports = register
