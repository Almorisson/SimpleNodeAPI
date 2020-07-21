const expressJwt = require('express-jwt');

exports.authenticate = expressJwt({
    secret: process.env.JWT_KEY,
    userProperty: "auth"
});
