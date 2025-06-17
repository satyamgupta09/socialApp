const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/auth_demo');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error connecting database'));

db.once('open', function(){
    console.log('Data connected successfully');
});