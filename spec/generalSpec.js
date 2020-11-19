const request = require('supertest');
const config = require('config');

/*
if (constants.isProd == true)
    API_URL = "https://apidomo.crabdance.com:3000"
else 
    API_URL = "http://localhost:3000"
*/

API_URL = "http://localhost:8020"
//console.log("ENVIRONMENT PROD : " + config.get('Constants.isProd'))

//console.log("API_URL : " + API_URL)


describe('General tests', () => {
    it('Test if API is online', (done) => {
        request(API_URL)
            .get('/test')
            .set('Accept', 'application/json')
            .expect({ message: "bonjour ProjetNodeAJ" }, done)
    })
})


