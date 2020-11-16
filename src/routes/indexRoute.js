login = require("./authRoutes/loginRoute")
other = require("./otherRoutes/otherRoute")
changePassword = require("./otherRoutes/changePassword")
register = require("./authRoutes/registerRoute")
forgotPass = require("./authRoutes/fortgotPass")

routes = require("express").Router()
const path = require("path")

//routes.use('/login', login);
routes.use("/", other)
routes.use("/", login)
routes.use("/", register)

routes.use("/users", register)
routes.use("/users/:_id", register)
routes.use("/", changePassword)
routes.use("/", forgotPass)

module.exports = routes
