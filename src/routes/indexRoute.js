const login = require('./authRoutes/loginRoute'),
    other = require('./otherRoutes/otherRoute'),
    changePassword = require('./otherRoutes/changePassword'),
    routes = require('express').Router()


//routes.use('/login', login);
routes.use('/', other);
routes.use('/', login);


module.exports = routes;