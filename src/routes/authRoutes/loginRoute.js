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
    users.find({ email: req.body.email }, function (err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            if (docs.length == 1)
                sr.sendReturn(res, 200,
                    {
                        error: false,
                        message: "User exists"
                    });
            else
                sr.sendReturn(res, 200,
                    {
                        error: false,
                        message: "User doesn't exists"
                    });
        }
    });
    /*
        connect.query(
            "SELECT * FROM users WHERE phone = '" + req.body.phone + "';", (error, results) => {
                // SQL error case
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
                            var token = jwt.sign({ id: results[0].id_user }, constants.jwtSecretUser, {
                                algorithm: "HS256"
                            })
                            //Update token
                            let insertData =
                            {
                                token: token,
                            };
                            id_user = results[0].id_user;
                            mail = results[0].mail;
                            connect.query("UPDATE users SET ? WHERE id_user = " + results[0].id_user + "", insertData, (error, results) => {
                                if (error) others.sendReturn(res);
                                else
                                    others.sendReturn(res, 200,
                                        {
                                            error: false,
                                            message: "login successful",
                                            id_user: id_user,
                                            token: token,
                                            mail: mail
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
            });
            */
})
//#endregion

module.exports = login;





