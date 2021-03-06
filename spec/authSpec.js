const request = require('supertest');
const config = require('config');
/*
if (constants.isProd == true)
    API_URL = "https://apidomo.crabdance.com:3000"
else 
    API_URL = "http://localhost:3000"
*/

API_URL = config.get('Constants.API_URL')
    //console.log("ENVIRONMENT PROD : " + config.get('Constants.isProd'))

// console.log("API_URL : " + API_URL)



describe('Login / Logout tests', () => {

    it('Test if login with incorrect email works', (done) => {
        request(API_URL)
            .post('/login')
            .send('email=tata@email.com&password=' + config.get('Constants.testUserPwd'))
            .set('Accept', 'application/json')
            .expect(401, done)
    })

    it('Test if login with incorrect password works', (done) => {
        request(API_URL)
            .post('/login')
            .send('email=' + config.get('Constants.testUserEmail') + '&password=mdpfaux')
            .set('Accept', 'application/json')
            .expect(401, done)
    })

    it('Test if login with existing user works', (done) => {
        request(API_URL)
            .post('/login')
            .send('email=' + config.get('Constants.testUserEmail') + '&password=' + config.get('Constants.testUserPwd'))
            .set('Accept', 'application/json')
            .expect(200, done)
    })

    it('Test if logout work', (done) => {
        request(API_URL)
            .post('/login')
            .send('email=' + config.get('Constants.testUserEmail') + '&password=' + config.get('Constants.testUserPwd'))
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res) {
                token = res.body.token
                if (err) return done(err);
                else {
                    request(API_URL)
                        .post('/logout')
                        .send('token=' + token)
                        .set('Accept', 'application/json')
                        .expect(200, done)
                }
            })
    })

    // Test limited attempt

    it('Test user attempt reset (admin)', (done) => {
        request(API_URL)
            .post('/resetUserTry')
            .send('email=' + config.get('Constants.testUserEmail') + '&adminKey=' + config.get('Constants.adminKey'))
            .set('Accept', 'application/json')
            .expect(200, done)

    })


    it('Test if limited attempt works', (done) => {
        request(API_URL)
            .post('/login')
            .send('email=' + config.get('Constants.testUserEmail') + '&password=pasbonjour')
            .set('Accept', 'application/json')
            .expect(401)
            .end(function(err, res) {
                token = res.body.token
                if (err) return done(err);
                else {
                    request(API_URL)
                        .post('/login')
                        .send('email=' + config.get('Constants.testUserEmail') + '&password=pasbonjour')
                        .set('Accept', 'application/json')
                        .expect(401)
                        .end(function(err, res) {
                            token = res.body.token
                            if (err) return done(err);
                            else {
                                request(API_URL)
                                    .post('/login')
                                    .send('email=' + config.get('Constants.testUserEmail') + '&password=pasbonjour')
                                    .set('Accept', 'application/json')
                                    .expect({ error: true, message: 'This user is currently blocked, please try later' })
                                    .end(function(err, res) {
                                        token = res.body.token
                                        if (err) return done(err);
                                        else {
                                            request(API_URL)
                                                .post('/resetUserTry')
                                                .send('email=' + config.get('Constants.testUserEmail') + '&adminKey=' + config.get('Constants.adminKey'))
                                                .set('Accept', 'application/json')
                                                .expect(200, done)
                                        }
                                    })
                            }
                        })
                }
            })
    })


    it('Test if limited attempt stop increment', (done) => {
        request(API_URL)
            .post('/login')
            .send('email=' + config.get('Constants.testUserEmail') + '&password=pasbonjour')
            .set('Accept', 'application/json')
            .expect(401)
            .end(function(err, res) {
                token = res.body.token
                if (err) return done(err);
                else {
                    request(API_URL)
                        .post('/login')
                        .send('email=' + config.get('Constants.testUserEmail') + '&password=pasbonjour')
                        .set('Accept', 'application/json')
                        .expect(401)
                        .end(function(err, res) {
                            token = res.body.token
                            if (err) return done(err);
                            else {
                                request(API_URL)
                                    .post('/login')
                                    .send('email=' + config.get('Constants.testUserEmail') + '&password=' + config.get('Constants.testUserPwd'))
                                    .set('Accept', 'application/json')
                                    .expect(200, done)

                            }
                        })
                }
            })
    })


    it('Test user attempt reset (admin) pt2', (done) => {
        request(API_URL)
            .post('/resetUserTry')
            .send('email=' + config.get('Constants.testUserEmail') + '&adminKey=' + config.get('Constants.adminKey'))
            .set('Accept', 'application/json')
            .expect(200, done)
    })
})




describe('Others auth related tests', () => {



    it('Test changing password with an incorrect password', (done) => {
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
                        .put('/changePassword')
                        .send('email=' + config.get('Constants.testUserEmail') + '&password=pasbonjour&password2=bonjour2' + '&token=' + token)
                        .set('Accept', 'application/json')
                        .expect(401, done)
                }
            })
    })

    it('Test if password change works', (done) => {
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
                        .put('/changePassword')
                        .send('email=' + config.get('Constants.testUserEmail') + '&password=' + config.get('Constants.testUserPwd') + '&password2=bonjour2' + '&token=' + token)
                        .set('Accept', 'application/json')
                        .expect(200)
                        .end(function(err2, res2) {
                            if (err2) return done(err2);
                            else {
                                request(API_URL)
                                    .put('/changePassword')
                                    .send('email=' + config.get('Constants.testUserEmail') + '&password2=' + config.get('Constants.testUserPwd') + '&password=bonjour2' + '&token=' + token)
                                    .set('Accept', 'application/json')
                                    .expect(200, done)
                            }
                        })
                }
            })
    })





    /*
    it('Test if lost password works', (done) => {
        request(API_URL)
            .post('/register')
            .send('email=tata@email.com&password=bonjour')
            .set('Accept', 'application/json')
            .expect(201, done)
    })
    */




})