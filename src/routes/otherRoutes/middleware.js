// External packages
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require('config');

// Local imports
var sr = require('../../others/sendReturn');




// #region midleware to check input data syntax
const middleware = (req, res, next) => {
    // empty/invalid sended data case
    function checkSendedValue() {
        return (req.body.email != undefined && String(req.body.email).match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == null) ||
            (req.body.password != undefined && req.body.password == "") ||
            (req.body.password2 != undefined && req.body.password2 == "") ||
            (req.body.token != undefined && req.body.token == "") ||
            (req.body.itineraryName != undefined && req.body.itineraryName == "") ||
            (req.body.emailUser != undefined && req.body.emailUser == "") ||
            (req.body.coordinate != undefined && req.body.coordinate == "");
    }
    if (checkSendedValue())
        sr.sendReturn(res, 403,
            {
                error: true,
                message: "One of the sended datas are invalid"
            });
    else {
        //console.log("success data !")
        next();
    }
};
//#endregion



//#region user token check middleware
const middlewareSessionUser = (req, res, next) => {
    // Check if it's a GET or a POST
    if (!req.body.token) {
        token = req.params.token
    }
    else {
        token = req.body.token
    }
    // no data case
    if (token == undefined || token.trim().length == 0) {
        sr.sendReturn(res, 401,
            {
                error: true,
                message: "Unauthorized"
            });
    }
    else {
            // check if an user is crurrently using this token 
        const users = require('../../models/usersModel');
        let user = new users();
        users.find({ token : token }, function (error, results) {
            if (error) sr.sendReturn(res);
            else {
                if (results === undefined || results.length == 0)
                    sr.sendReturn(res, 401,
                        {
                            error: true,
                            message: "Unauthorized"
                        });
                else {
                    var success = true
                    try {
                        var decoded = jwt.verify(token, config.get('Constants.jwtSecretUser'));
                    }
                    catch (e) {
                        success = false
                        sr.sendReturn(res, 401,
                            {
                                error: true,
                                message: "Unauthorized"
                            });
                    }
                    if (success == true) {
                        if (results[0]._id != decoded._id) {
                            sr.sendReturn(res, 401,
                                {
                                    error: true,
                                    message: "Unauthorized"
                                });
                        }
                        else {
                            next();
                        }
                    }
                }
            }
        })
    }
};
//#endregion



// Exports all the functions
module.exports =
{
    middleware: middleware,
    middlewareSessionUser: middlewareSessionUser
};