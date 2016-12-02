'use strict';
// TOKEN VERIFICATION MODULES //

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

function tokenResultsHandler(err, result) {
  if (err) {
    console.error('error', err);
    return [200, true];
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

module.exports={verifyUser};
