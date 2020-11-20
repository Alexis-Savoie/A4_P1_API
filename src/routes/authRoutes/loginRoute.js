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
                // Check cooldown date
                d = Date.now()
                if (results[0].cooldownDate < d) {
                    bcrypt.compare(req.body.password, results[0].password).then(isOk => {
                        if (isOk) {
                            //Version that never expire
                            var token = jwt.sign("token", config.get('Constants.jwtSecretUser'), { algorithm: "HS256" })

                            email = results[0].email;
                            users.findOneAndUpdate({ _id: results[0]._id }, { token: token, nbTry : 0 }, { upsert: true }, function (error, results2) {
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

                                        // Login user and replace his old password by the generated one
                                        users.findOneAndUpdate({ _id: _id }, { password: req.body.password, token: token, temporary_password: "", nbTry : 0 }, { upsert: true }, function (error, results3) {
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
                                })
                            }
                            else {
                                // Check number of tries and add one or change cooldown
                                if (results[0].nbTry >= 2) {
                                    var oldDateObj = new Date();
                                    var newDateObj = new Date();
                                    newDateObj.setTime(oldDateObj.getTime() + (5 * 60 * 1000));
                                    users.findOneAndUpdate({ _id: results[0]._id }, { cooldownDate: newDateObj, nbTry: 0 }, { upsert: true }, function (error, results4) {
                                        if (error) sr.sendReturn(res);
                                        else {
                                            sr.sendReturn(res, 401,
                                                {
                                                    error: true,
                                                    message: "Too many failed attempt you are now blocked for some time"
                                                });
                                        }
                                    });
                                }
                                else {
                                    users.findOneAndUpdate({ _id: results[0]._id }, { nbTry: (results[0].nbTry + 1) }, { upsert: true }, function (error, results5) {
                                        if (error) sr.sendReturn(res);
                                        else {
                                            sr.sendReturn(res, 401,
                                                {
                                                    error: true,
                                                    message: "Incorrect username/password"
                                                });
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
                else
                    sr.sendReturn(res, 401,
                        {
                            error: true,
                            message: "This user is currently blocked, please try later"
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