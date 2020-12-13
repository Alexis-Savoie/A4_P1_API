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
gmaps.get("/getRoute/:token/:origin/:waypoints", middleware.middlewareSessionUser, async(req, res) => {
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


        //console.log(routes)


        // We need to made the request async to properly wait for the request response
        async function httpRequest(origin, destination, key, waypoints) {
            return axios({
                method: "get",
                url: 'https://maps.googleapis.com/maps/api/directions/json?origin=' + origin + '&destination=' + destination + '&mode=driving&key=' + key + '&waypoints=' + waypoints + '&region=FR&language=fr&optimizeWaypoints=true',
            }).then(res => res).catch(error => error);
        }


        let success = true
        for (let i = 0; i < routes.length; i++) {

            // MAke the request and wait for the response
            let res2 = await httpRequest(origin, routes[i][1], key, routes[i][0])

            console.log(res2.status)

            // INvalid adress case
            if (res2.data.status == "NOT_FOUND" && success == true) {
                console.log(1)
                success = false
                sr.sendReturn(res, 404, {
                    error: true,
                    message: "Location not found"
                });
            }
            // SUccess case
            else {
                if ((res2.data.routes[0])) {
                    console.log(2)
                        // Store response data
                    resRoutes.push(res2.data)

                    // Calculate the duration of this itinerary
                    let j = 0
                    totalTime = 0
                    while (j < res2.data.routes[0].legs.length) {
                        totalTime += res2.data.routes[0].legs[j].duration.value
                        j = j + 1
                    }

                    // Store the duration
                    listDuration.push(totalTime)


                    // Find fastest itinerary
                    let index = 0;
                    let value = listDuration[0];
                    for (let k = 1; k < listDuration.length; k++) {
                        if (listDuration[k] < value) {
                            value = listDuration[k];
                            index = k;
                        }
                    }

                    // Save itinerary for the API response
                    order = routes[index][0].toString() + "|" + routes[index][1].toString()
                    shortestRoute = resRoutes[index]
                    console.log(order)


                }
                // Failure case
                else {
                    if (success == true) {
                        console.log(3)
                        success = false
                        sr.sendReturn(res);
                    }


                }
            }




        }
        if (success == true) {
            sr.sendReturn(res, 200, {
                error: false,
                message: "Shortest route found",
                order: order,
                route: shortestRoute
            });
        }







    })
    //#endregion

module.exports = gmaps