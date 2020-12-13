login = require("./authRoutes/loginRoute")
other = require("./otherRoutes/otherRoute")
changePassword = require("./otherRoutes/changePassword")
register = require("./authRoutes/registerRoute")
forgotPass = require("./authRoutes/fortgotPass")
adminAuth = require("./adminRoutes/adminAuthRoute")
gmaps = require("./otherRoutes/gmaps")

routes = require("express").Router()
const path = require("path")

routes.use("/", other)
routes.use("/", adminAuth)

routes.use("/", login)
routes.use("/", register)

routes.use("/", changePassword)
routes.use("/", forgotPass)

routes.use("/", gmaps)

module.exports = routes