login = require("./authRoutes/loginRoute")
other = require("./otherRoutes/otherRoute")
changePassword = require("./otherRoutes/changePassword")
register = require("./authRoutes/registerRoute")
resetPass = require("./authRoutes/resetpasswordRoute")

routes = require("express").Router()
const path = require("path")


routes.use("/", other)
routes.use("/", login)
routes.use("/", register)

routes.use("/users", register)
routes.use("/users/:_id", register)
routes.use("/", changePassword)
routes.use("/", resetPass)

module.exports = routes
