login = require('./authRoutes/loginRoute')
other = require('./otherRoutes/otherRoute')
changePassword = require('./otherRoutes/changePassword')
register = require("./authRoutes/registerRoute")
routes = require('express').Router()


//routes.use('/login', login);
routes.use('/', other);
routes.use('/', login);
routes.use("/", register)
routes.use("/", changePassword)


module.exports = routes;