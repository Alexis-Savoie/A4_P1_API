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
            .send('email=toto@email.com&password=')
            .set('Accept', 'application/json')
            .expect(403, done)
    })

    it('Test sending invalid email', (done) => {
        request(API_URL)
            .post('/login')
            .send('email=totogmail.com&password=bonjour2')
            .set('Accept', 'application/json')
            .expect(403, done)
    })
})



describe('Session middleware tests', () => {

    it('Test without token', (done) => {
        request(API_URL)
            .put('/changePassword')
            .send('email=toto@email.com&password=bonjour2&password2=bonjour3')
            .set('Accept', 'application/json')
            .expect(401, done)
    })

    it('Test with invalid token', (done) => {
        request(API_URL)
            .put('/changePassword')
            .send('email=toto@email.com&password=bonjour2&password2=bonjour3&token=tokeninvalide')
            .set('Accept', 'application/json')
            .expect(401, done)
    })
})