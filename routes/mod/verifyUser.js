'use strict';

// TOKEN VERIFICATION MODULES //

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

function tokenResultsHandler(err, result) {
  if (err) {
    return [200, false];
  }
  else if (result) {
    return [200, true];
  }
}

function verifyUser(token) {
  if (token) {
    return tokenResultsHandler(jwt.verify(token, secret));
  }
  else if (!token) {
    return tokenResultsHandler(true, false);
  }
}

function checkVerification(req, res, next) {
  if (!req.cookies.token) {
    next(401);
  }
  else if (req.cookies.token) {
    verifyUser(req.cookies.token);
    
    // should assign to "verified" & check for success before continuing
  }

  next();

  // if (!verified[1]) {
  //   next(200);
  // }
  // else {
  //   next();
  // }

}

module.exports = { verifyUser, checkVerification };
