// External packages
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require('config');

// Local imports
var sr = require('../../others/sendReturn');
const middleware = require('./middleware');

// For exports
const history = require('express').Router();


//#region HistoryRoute

history.get("/getHistory/:token", middleware.middlewareSessionUser, (req, res) => {
    const users = require('../../models/usersModel');
    users.find({ email: req.body.email }, function(error, results) {
        console.log(results[0].history)
        if (results[0].history.length == 0)
            sr.sendReturn(res, 404, {
                error: true,
                message: "This user have an empty history"
            });
        else {
            rHistory = results[0].history
                // We use reverse to have the history sorted by most recent first
            rHistory.reverse()
            sr.sendReturn(res, 200, {
                error: false,
                history: rHistory
            });
        }

    })
})



history.post("/addToHistory", middleware.middlewareSessionUser, (req, res) => {
    const users = require('../../models/usersModel');
    // COnstruct history object 
    insertObj = {
            origin: req.body.origin,
            waypoints: req.body.waypoints
        }
        // Push the new history entry
    users.findOneAndUpdate({ email: req.body.email }, { $push: { history: insertObj } }, { upsert: true }, function(error, results) {
        sr.sendReturn(res, 201, {
            error: false,
            message: "Added succesfully to the history"
        });
    });

})

//#endregion


module.exports = history;