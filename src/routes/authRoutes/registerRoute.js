const register = require("express").Router()
const { Users } = require("../../models/usersModel")
const mongoose = require("mongoose")
register.post("/register", async (req, res) => {
  console.log("All equipement ", req.body)
})
module.exports = register
