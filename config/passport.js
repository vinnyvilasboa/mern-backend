require('dotenv').config();
// A passport strategy for authenticating with a JSON Web Token
// This allows to authenticate endpoints using a token
const { Strategy, ExtractJwt } = require('passport-jwt');

// model
const { User } = require('../models');

const options = {   
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // JWT_SECRET is inside of our environment. 
    secretOrKey: process.env.JWT_SECRET
};

const JWT_STRATEGY = new Strategy(options, async (jwt_payload, done) => {
    // Have a user that we're going to find by the id in the payload
    // When we get a user back, we will check to see if user is in database.
    try {
        console.log('jwt_payload', jwt_payload);
        const user = await User.findById(jwt_payload.id);
        console.log('strategy ==>', user);
        
        if (user) {
            // If a user is found, return null (for error) and the user
            return done(null, user);
        } else {
            // No user was found
            return done(null, false);
        }
    } catch (error) {
        console.log('------- ERROR inside passport.js file --------');
        console.log(error);
    }
});

module.exports = async (passport) => {
    passport.use(JWT_STRATEGY);
}