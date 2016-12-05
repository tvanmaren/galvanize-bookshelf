'use strict';
// TOKEN VERIFICATION MODULES //

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

function tokenResultsHandler(err, result) {
  if (err) {
    console.error('error', err);
    return [200, false];
  } else if (result) {
    console.log('result:', result);
    return [200, true];
  }
}

function verifyUser(token) {
  if (token) {
    console.log('verifyUser', 'token:', token);
    return tokenResultsHandler(jwt.verify(token, secret));
  } else {
    console.log('verifyUser', 'token:', token);
    return tokenResultsHandler(true, false);
  }
}

function checkVerification(req, res, next) {
  let verified;
  if (req.cookies.token) {
    verified = verifyUser(req.cookies.token);
    console.log('verified:', verified);
  } else {
    console.log('no token in request');
    next(401);
  }
  next();

  // if (!verified[1]) {
  //   next(200);
  // }
  // else {
  //   next();
  // }
}

module.exports={verifyUser, checkVerification};
