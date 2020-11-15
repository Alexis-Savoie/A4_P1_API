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

console.log("API_URL : " + API_URL)



describe('Syntaxe middleware tests', () => {

    it('Test sending empty value', (done) => {
        request(API_URL)
            .post('/login')
            .send('email=' + config.get('Constants.testUserEmail') + '&password=')
            .set('Accept', 'application/json')
            .expect(403, done)
    })

    it('Test sending invalid email', (done) => {
        request(API_URL)
            .post('/login')
            .send('email=fauxemailemail.com&password=bonjour2')
            .set('Accept', 'application/json')
            .expect(403, done)
    })
})



describe('Session middleware tests', () => {

    it('Test without token', (done) => {
        request(API_URL)
            .put('/changePassword')
            //.send('email=toto@email.com&password=bonjour&password2=bonjour2')
            //console.log('email=' + config.get('Constants.testUserEmail') + '&password=' + config.get('Constants.testUserPwd') + '&password2=bonjour2')
            .send('email=' + config.get('Constants.testUserEmail') + '&password=' + config.get('Constants.testUserPwd') + '&password2=bonjour2')
            .set('Accept', 'application/json')
            .expect(401, done)
    })

    it('Test with invalid token', (done) => {
        request(API_URL)
            .put('/changePassword')
            .send('email=' + config.get('Constants.testUserEmail') + '&password=' + config.get('Constants.testUserPwd') + '&password2=bonjour2$token=tokeninvalide')
            .set('Accept', 'application/json')
            .expect(401, done)
    })
})