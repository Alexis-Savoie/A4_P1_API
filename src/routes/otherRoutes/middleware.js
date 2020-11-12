var sr = require('../../others/sendReturn');
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")





// #region midleware to check input data syntax
const middleware = (req, res, next) => {
    // empty/invalid sended data case
    function checkSendedValue() {
        return (req.body.email != undefined && String(req.body.email).match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == null) ||
            (req.body.password != undefined && req.body.password == "") ||
            (req.body.password2 != undefined && req.body.password2 == "") ||
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



// Exports all the functions
module.exports =
{
    middleware: middleware
};