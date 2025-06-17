// // config/passport.js

// const passport = require('passport');
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const User = require('../model/user');
// // const keys = require('./keys');
// const keys = require('../config/keys');


// const opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = keys.secretOrKey;

// module.exports = passport => {
//     passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
//         User.findById(jwt_payload.id)
//             .then(user => {
//                 if (user) {
//                     return done(null, user);
//                 }
//                 return done(null, false);
//             })
//             .catch(err => console.log(err));
//     }));
// };

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../model/user');

let opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken,
    secretOrKey : 'codeial'
}

passport.use(new JwtStrategy(opts, function(jwtPayLoad, done){
    User.findById(jwtPayLoad._id, function(err, user){
        if(err) {console.log('Error in finding user from JWT'); return;}
        if(user){
            return done(null, user);
        }
        else{
            return done(null,false);
        }
    })
}));