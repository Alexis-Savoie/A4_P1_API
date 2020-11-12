login = require("./authRoutes/loginRoute.js")
other = require("./otherRoutes/otherRoute.js")
register = require("./authRoutes/registerRoute")
routes = require("express").Router()


routes.use("/", other)
routes.use('/', login);
routes.use("/", register)

// routes.use("/register", register)

module.exports = routes
