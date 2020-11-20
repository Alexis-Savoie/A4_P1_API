const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require('config');

// Local imports
var sr = require('../../others/sendReturn');
const middleware = require('../otherRoutes/middleware');

// For exports
const adminAuth = require('express').Router();


//#region user logout route
login.post("/resetUserTry", (req, res) => {
    // check if it's an developer using the route
    if (req.body.adminKey != config.get('Constants.adminKey'))
    {
        sr.sendReturn(res, 401,
            {
                error: true,
                message: "Unauthorized"
            });
    }
    else
    {
        // check if an user is registered with this username
        const users = require('../../models/usersModel');
        let user = new users();

        users.findOneAndUpdate({ email: req.body.email }, { nbTry : 0, cooldownDate : Date.parse('01 Jan 1970 00:00:00') }, { upsert: true }, function (error, results) {
            if (error) sr.sendReturn(res);
            else
                sr.sendReturn(res, 200,
                    {
                        error: false,
                        message: "success !"
                    });
        });
    }
})
//#endregion

module.exports = adminAuth;