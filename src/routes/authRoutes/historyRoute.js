// External packages
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require('config');

// Local imports
var sr = require('../../others/sendReturn');
const middleware = require('../otherRoutes/middleware');

// For exports
const history = require('express').Router();


//HistoryRoute

//#region user connexion route
history.post("/history", (req, res) => {

    let origin = req.params.origin;
    let dests = req.params.waypoints;
    // check if an user is registered with this username
    const users = require('../../models/usersModel');
    let user = new users();
    //console.log(req.body)
    users.find({ dests: req.params.waypoints}, function(error, results) {
        if (error) sr.sendReturn(res);
        else {
            // mongoDB error case
            if (error) sr.sendReturn(res);
            // if empty result
            else if (results.length == 0)
                sr.sendReturn(res, 401, {
                    error: true,
                    message: "destination not exist"
                });

            // if it's a existing username then check password 
            else {
                // Check cooldown date
                 // Check cooldown date

               
            }
        }
    });
})
//#endregion

module.exports = history;