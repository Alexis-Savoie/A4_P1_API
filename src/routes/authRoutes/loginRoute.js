// Login route
var sr = require('../../others/sendReturn');
const middleware = require('../otherRoutes/middleware');
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const login = require('express').Router();




//#region user connexion route
login.post("/login", (req, res) => {
    // check if an user is registered with this username
    const users = require('../../models/usersModel');
    let user = new users();
    //console.log(req.body)
    users.find({ email: req.body.email }, function (error, results) {
        if (error) {
            console.log(error);
        }
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
                        var token = jwt.sign({ id: results[0]._id }, "prout", {
                            algorithm: "HS256"
                        })
                        //Update token
                        let insertData =
                        {
                            token: token,
                        };

                        email = results[0].email;

                        users.findOneAndUpdate({ _id: results[0]._id }, { token: token }, { upsert: true }, function (err, doc) {
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
login.post("/logout", (req, res) => {
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





