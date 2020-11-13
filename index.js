// External packages
const express = require('express'); 
const bodyParser = require("body-parser")

// Local imports
global.bdd = require('./src/models/indexModel');
const route = require('./src/routes/indexRoute');
const middleware = require('./src/routes/otherRoutes/middleware')

const app = express(); 




const port = process.env.PORT || 8020; // Port ecoute du server


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Middelware
app.use('/', middleware.middleware);
app.use(route);




// Run serve
app.listen(port, () => console.log(`listening on http://localhost:${port}`));