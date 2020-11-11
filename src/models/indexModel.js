const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/projetNodeAJ', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

mongoose.connection.on('connected', () => {
    console.log('MongoDb is run');
})

module.exports = mongoose;