const request = require("supertest")
const config = require("config")
/*
if (constants.isProd == true)
    API_URL = "https://apidomo.crabdance.com:3000"
else 
    API_URL = "http://localhost:3000"
*/

API_URL = "http://localhost:8020"
//console.log("ENVIRONMENT PROD : " + config.get('Constants.isProd'))

console.log("API_URL : " + API_URL)

describe("Register tests", () => {

  it('Test register with an already existing mail', (done) => {
    request(API_URL)
        .post('/register')
        .send('email=' + config.get('Constants.testUserEmail') + '&password=' + config.get('Constants.testUserPwd'))
        .set('Accept', 'application/json')
        .expect(401, done)

})

})
