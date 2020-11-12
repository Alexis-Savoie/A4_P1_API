const login = require('./authRoutes/loginRoute.js'),
    other = require('./otherRoutes/otherRoute.js'),
    routes = require('express').Router()


//routes.use('/login', login);
routes.use('/', other);
routes.use('/', login);

module.exports = routes;