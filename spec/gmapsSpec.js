const request = require('supertest');
const config = require('config');



API_URL = config.get('Constants.API_URL')



describe('Google maps related tests', () => {



    it('Check if the route works', (done) => {
        request(API_URL)
            .post('/login')
            .send('email=' + config.get('Constants.testUserEmail') + '&password=' + config.get('Constants.testUserPwd'))
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                else {
                    token = res.body.token
                    request(API_URL)
                        .get('/getRoute/' + token + '/Arpajon/Dourdan|Etampes')
                        .set('Accept', 'application/json')
                        .expect(200, done)
                }
            })
    })
})