// External packages
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require('config');

// Local imports
var sr = require('../../others/sendReturn');
const middleware = require('../otherRoutes/middleware');

// For exports
const login = require('express').Router();



//#region user connexion route
login.post("/login", (req, res) => {
    // check if an user is registered with this username
    const users = require('../../models/usersModel');
    let user = new users();
    //console.log(req.body)
    users.find({ email: req.body.email }, function (error, results) {
        if (error) sr.sendReturn(res);
        else {
            // mongoDB error case
            if (error) sr.sendReturn(res);
            // if empty result
            else if (results.length == 0)
                sr.sendReturn(res, 401,
                    {
                        error: true,
                        message: "Incorrect username/password"
                    });

            // if it's a existing username then check password 
            else {
                bcrypt.compare(req.body.password, results[0].password).then(isOk => {
                    if (isOk) {
                        //Version that never expire
                        var token = jwt.sign({ _id: results[0]._id }, config.get('Constants.jwtSecretUser'), {
                            algorithm: "HS256"
                        })

                        email = results[0].email;
                        users.findOneAndUpdate({ _id: results[0]._id }, { token: token }, { upsert: true }, function (error, results) {
                            if (error) sr.sendReturn(res);
                            else
                                sr.sendReturn(res, 200,
                                    {
                                        error: false,
                                        message: "login successful",
                                        token: token,
                                        email: email
                                    });
                        });
                    }
                    else {
                        // Check if user try to use an temporary password
                        if (results[0].temporary_password != undefined && results[0].temporary_password != "") {
                            bcrypt.compare(req.body.password, results[0].temporary_password).then(isOk => {
                                if (isOk) {
                                    //Version that never expire
                                    var token = jwt.sign({ _id: results[0]._id }, config.get('Constants.jwtSecretUser'), {
                                        algorithm: "HS256"
                                    })

                                    email = results[0].email;
                                    _id = results[0]._id;
                                    // Generate token and overwrite password with temporary password (and delete temporary_password field)
                                    // Generate token
                                    users.findOneAndUpdate({ _id: _id }, { token: token }, { upsert: true }, function (error, results) {
                                        if (error) sr.sendReturn(res);
                                        else {
                                            // Replace old password with temporary password
                                            users.findOneAndUpdate({ _id: _id }, { password: req.body.password }, { upsert: true }, function (error, results) {
                                                if (error) sr.sendReturn(res);
                                                else {
                                                    users.findOneAndUpdate({ _id: _id }, { token: token }, { upsert: true }, function (error, results) {
                                                        if (error) sr.sendReturn(res);
                                                        else {
                                                            // Remove temporary password field
                                                            users.findOneAndUpdate({ _id: _id }, { temporary_password: "" }, { upsert: true }, function (error, results) {
                                                                if (error) sr.sendReturn(res);
                                                                else {
                                                                    sr.sendReturn(res, 200,
                                                                        {
                                                                            error: false,
                                                                            message: "login successful (temporary password)",
                                                                            token: token,
                                                                            email: email
                                                                        });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            })
                        }
                        else
                            sr.sendReturn(res, 401,
                                {
                                    error: true,
                                    message: "Incorrect username/password"
                                });
                    }
                });
            }
        }
    });
})
//#endregion


//#region user logout route
login.post("/logout", middleware.middlewareSessionUser, (req, res) => {
    // check if an user is registered with this username
    const users = require('../../models/usersModel');
    let user = new users();

    users.findOneAndUpdate({ token: req.body.token }, { token: "" }, { upsert: true }, function (error, results) {
        if (error) sr.sendReturn(res);
        else
            sr.sendReturn(res, 200,
                {
                    error: false,
                    message: "logout successful"
                });
    });
})
//#endregion





module.exports = login;