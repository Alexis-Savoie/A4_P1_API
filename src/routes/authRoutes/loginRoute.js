// Login route
var sr = require('../../others/sendReturn');
const bodyParser = require("body-parser")

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
            if (error) others.sendReturn(res);
            // if empty result
            else if (results.length == 0)
                others.sendReturn(res, 401,
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
                        req.newData.username = token;

                        MyModel.findOneAndUpdate({ '_id': results[0]._id }, req.newData, { upsert: true }, function (err, doc) {
                            if (error) others.sendReturn(res);
                            else
                                others.sendReturn(res, 200,
                                    {
                                        error: false,
                                        message: "login successful",
                                        token: token,
                                        email: email
                                    });
                        });

                    }
                    else {
                        others.sendReturn(res, 401,
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
    
    req.newData.username = "";
    MyModel.findOneAndUpdate({ 'token': req.body.token }, req.newData, { upsert: true }, function (err, doc) {
        if (error) others.sendReturn(res);
        else
            others.sendReturn(res, 200,
                {
                    error: false,
                    message: "login successful",
                    token: token,
                    email: email
                });
    });
})
//#endregion






module.exports = login;





