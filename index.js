const express = require("express") // Chargement Express
const bodyParser = require("body-parser")
const app = express() // Instance Express

global.bdd = require("./src/models/indexModel")
const route = require("./src/routes/indexRoute")

const middleware = require("./src/routes/otherRoutes/middleware")

//Zone de test
/*

const users = require('./src/models/usersModel');
let newUser = new users();
const itinerary = require('./src/models/itineraryModel');
let newItinerary = new itinerary();


newUser.email = 'toto@email.com'
newUser.password = 'motdepasse'

//newItinerary.coordinate = "[23.333,54.234]|[34.121,87.123]"
///newItinerary.itineraryName = "trajet de ouf"
//newItinerary.emailUser = "toto@email.com"


newUser.save()
//newItinerary.save()

*/
//End Zone de test

const port = process.env.PORT || 8020 // Port ecoute du server

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Middelware
app.use("/", middleware.middleware)
app.use(route)

// Run serve
app.listen(port, () => console.log(`listening on http://localhost:${port}`))
