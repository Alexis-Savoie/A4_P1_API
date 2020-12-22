const request = require('supertest');
const config = require('config');



API_URL = config.get('Constants.API_URL')



describe('Google maps related tests', () => {



    it('As intended case', (done) => {
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


    it('invalid adress case', (done) => {
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
                        .get('/getRoute/' + token + '/Arpajon/Dourdaaaaaan|Etampes')
                        .set('Accept', 'application/json')
                        .expect({ error: true, message: 'Invalid location' }, done)
                }
            })
    })


    it('Too many address case', (done) => {
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
                        .get('/getRoute/' + token + '/Arpajon/Dourdan|Etampes|Dourdan|Etampes|Dourdan|Etampes|Dourdan|Etampes|Dourdan|Etampes|Dourdan|Etampes|Dourdan|Etampes|Dourdan|Etampes|Dourdan|Etampes|Dourdan|Etampes|Dourdan|Etampes|Dourdan|Etampes|Dourdan|Etampes|Dourdan|Etampes')
                        .set('Accept', 'application/json')
                        .expect({ error: true, message: 'Too many locations' }, done)
                }
            })
    })


})