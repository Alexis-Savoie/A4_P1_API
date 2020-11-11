const Users = require("../models/usersModel")

exports.register = function(req, res) {
  let user = new Users(req.body)
  user
    .register()
    .then(() => {
      req.session.user = { email: user.data.email, _id: user.data._id }
      req.session.save(function() {
        res.redirect("/")
      })
    })
    .catch(regErrors => {
      regErrors.forEach(function(error) {
        req.flash("regErrors", error)
      })
      req.session.save(function() {
        res.redirect("/")
      })
    })
}
