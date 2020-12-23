const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require('config');
const https = require('https')
const axios = require('axios');
const { Client } = require("@googlemaps/google-maps-services-js");

// Local imports
const middleware = require("../otherRoutes/middleware")
var sr = require("../../others/sendReturn")

// For export
const gmaps = require("express").Router()


//#region Get shortest itinery for a set of steps
gmaps.get("/getRoute/:token/:origin/:waypoints", middleware.middlewareSessionUser, async(req, res) => {
        // Get request params
        let origin = req.params.origin;
        let dests = req.params.waypoints.split('|');
        let wp4 = []

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
        listDistance = []
            //console.log(routes)


        // We need to made the request async to properly wait for the request response
        async function httpRequest(origin, destination, key, waypoints) {
            return axios({
                method: "get",
                url: encodeURI('https://maps.googleapis.com/maps/api/directions/json?origin=' + origin + '&destination=' + destination + '&mode=driving&key=' + key + '&waypoints=' + waypoints + '&region=FR&language=fr&optimizeWaypoints=true'),
            }).then(res => res).catch(error => error);
        }


        let success = true
        for (let i = 0; i < routes.length; i++) {
            // MAke the request and wait for the response
            let res2 = await httpRequest(origin, routes[i][1], key, routes[i][0])
                //console.log('https://maps.googleapis.com/maps/api/directions/json?origin=' + origin + '&destination=' + destination + '&mode=driving&key=' + key + '&waypoints=' + waypoints + '&region=FR&language=fr&optimizeWaypoints=true')

            //console.log(res2)
            // INvalid adress case
            if (res2.data.status == "NOT_FOUND" && success == true) {
                success = false
                sr.sendReturn(res, 403, {
                    error: true,
                    message: "Invalid location"
                });
            }
            // Too many waypoints
            else if (res2.data.status == "MAX_WAYPOINTS_EXCEEDED" && success == true) {
                success = false
                sr.sendReturn(res, 401, {
                    error: true,
                    message: "Too many locations"
                });
            }
            // SUccess case
            else {
                //console.log(res2.data.status)
                if ((res2.data.routes[0])) {
                    // Store response data
                    resRoutes.push(res2.data)

                    // Calculate the duration of this itinerary
                    let j = 0
                    totalTime = 0
                    totalDistance = 0
                    while (j < res2.data.routes[0].legs.length) {
                        totalDistance += res2.data.routes[0].legs[j].distance.value
                        totalTime += res2.data.routes[0].legs[j].duration.value
                        j = j + 1
                    }

                    // Store the duration and distance
                    listDuration.push(totalTime)
                    listDistance.push(totalDistance / 1000)



                }
                // Failure case
                else {
                    if (success == true) {
                        success = false
                        sr.sendReturn(res);
                    }
                }
            }
        }
        if (success == true) {
            // Find fastest itinerary
            let index = 0;
            let value = listDuration[0];
            for (let k = 1; k < listDuration.length; k++) {
                if (listDuration[k] < value) {
                    value = listDuration[k];
                    index = k;
                }
            }

            //Get correct orders of waypoints
            origin = resRoutes[index].routes[0].legs[0].start_address
            for (let m = 0; m < resRoutes[index].routes[0].legs.length; m++) {
                wp4.push(resRoutes[index].routes[0].legs[m].end_address);
            }

            // Add destination for the HTTP response
            destination = wp4.pop()


            sr.sendReturn(res, 200, {
                error: false,
                message: "Shortest route found",
                origin: origin,
                waypoints: wp4,
                destination: destination,
                distance: listDistance[index]
            });
        }
    })
    //#endregion

module.exports = gmaps