var sr = require('../../others/sendReturn');
const middleware = require('../otherRoutes/middleware');
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")

const changePassword = require('express').Router();




//#region change user password route
changePassword.put("/user/updateUserPassword", (req, res) => {
    // check if an user is registered with this username
    const users = require('../../models/usersModel');
    let user = new users();
    //console.log(req.body)
    users.find({ email: req.body.email }, function (error, results) {
        // SQL error case
        if (error) sr.sendReturn(res);
        //if no results then id does not exist
        else {
            if (results === undefined || results.length == 0) {
                sr.sendReturn(res, 401,
                    {
                        error: true,
                        message: "user does not exists"
                    });
            }
            else {
                // Check if the original password is correct
                bcrypt.compare(req.body.password, results[0].password).then(isOk => {
                    if (isOk) {
                        if (req.body.password2 != null || req.body.password2 == "") {
                            const hashPassword = async () => {
                                // Update password using a async function, due to bcrypt operation
                                req.body.password2 = await new Promise(resolve => {
                                    bcrypt.genSalt(10, async (err, salt) => {
                                        return await bcrypt.hash(req.body.password2, salt, (err, hash) => {
                                            resolve(hash);
                                        });
                                    });
                                });
                                // once the password is hashed we save it in the DB
                                req.newData.token = token;

                                users.findOneAndUpdate({ '_id': results[0]._id }, req.newData, { upsert: true }, function (err, doc) {
                                    if (error) sr.sendReturn(res);
                                    else {
                                        sr.sendReturn(res, 201,
                                            {
                                                error: false,
                                                message: "Password succesfully changed"
                                            });
                                    }
                                    //if (error) console.log(error)
                                })
                            }
                            hashPassword()
                        }
                        else {
                            sr.sendReturn(res, 401,
                                {
                                    error: true,
                                    message: "One of the sended datas are invalid"
                                });
                        }
                    }
                    else {
                        sr.sendReturn(res, 401,
                            {
                                error: true,
                                message: "Incorrect password"
                            });
                    }
                });
            }
        }
    });
})
//#endregion