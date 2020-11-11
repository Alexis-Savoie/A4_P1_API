login = require("./authRoutes/loginRoute.js")
other = require("./otherRoutes/otherRoute.js")
routes = require("express").Router()
const userController = require("../controllers/userController")
const express = require("express")

routes.post("/register", userController.register)
//routes.use('/login', login);

routes.use("/", other)

// routes.use("/register", register)

module.exports = routes
