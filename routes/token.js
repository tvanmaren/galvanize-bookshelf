'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE

router.get('/token', (req, res, next) => {
  if (req.signedCookies) {
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;
