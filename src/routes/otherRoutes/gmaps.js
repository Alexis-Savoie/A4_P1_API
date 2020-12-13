const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require('config');
const https = require('https')
const axios = require('axios');

// Local imports
const middleware = require("../otherRoutes/middleware")
var sr = require("../../others/sendReturn")

// For export
const gmaps = require("express").Router()


//#region Get shortest itinery for a set of steps
changePassword.get("/getRoute/:token/:origin/:waypoints", middleware.middlewareSessionUser, (req, res) => {
        // Get request params
        const origin = req.params.origin;
        let dests = req.params.waypoints.split('|');

        // Prepare request
        const key = config.get('Constants.GMAPS_API_KEY')





        // Create an array of every possible destinations, and then rely on google waypoints optimization to get the fatest route possible
        routes = []
        destsLen = dests.length
        for (let i = 0; i < destsLen; i++) {
            waypoints = []
            bDests = dests.slice()
            let buffer = bDests[destsLen - 1]
            bDests[destsLen - 1] = bDests[i]
            bDests[i] = buffer
            for (let i = 0; i < bDests.length - 1; i++) {
                waypoints.push(bDests[i]);
            }
            routes.push([waypoints.join('|'), bDests[destsLen - 1]])
        }


        resRoutes = []
        listDuration = []


        console.log(routes)






        // Use a calback because request are async
        function getRoutes(routes, callback) {
            for (let i = 0; i < routes.length; i++) {

                axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + origin + '&destination=' + routes[i][1] + '&mode=driving&key=' + key + '&waypoints=' + routes[i][0] + '&region=FR&language=fr&optimizeWaypoints=true')
                    .then(res => {
                        resRoutes.push(res.data)

                        i = 0
                        totalTime = 0
                        while (i < res.data.routes[0].legs.length) {
                            totalTime += res.data.routes[0].legs[i].duration.value
                            i = i + 1
                        }

                        listDuration.push(totalTime)
                        console.log(totalTime)
                        console.log(routes)
                            //console.log('https://maps.googleapis.com/maps/api/directions/json?origin=' + origin + '&destination=' + routes[i][1] + '&mode=driving&key=' + key + '&waypoints=' + routes[i][0] + '&region=FR&language=fr&optimizeWaypoints=true')




                        // Once every route was obtained we start the callcback
                        if (listDuration[routes.length - 1] != undefined) {
                            console.log("done")
                            callback(resRoutes, listDuration);
                        }


                    })
                    .catch(error => {
                        if (error.reponse) {
                            console.log(error.response.data)

                        } else {
                            console.log(error)
                        }

                    })

            }
        }

        // Wait for all requests to finish using a callback
        // And then compare what is the fastest route
        getRoutes(routes, function(resRoutes, listDuration) {

            let index = 0;
            let value = listDuration[0];
            for (let i = 1; i < listDuration.length; i++) {
                if (listDuration[i] < value) {
                    value = listDuration[i];
                    index = i;
                }
            }

            console.log(listDuration)
            console.log(routes[index][0] + "|" + routes[index][1])
            console.log(listDuration[index])
            console.log(resRoutes[index])
        });



    })
    //#endregion

module.exports = gmaps