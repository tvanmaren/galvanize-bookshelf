'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const jwt=require('jsonwebtoken');

// YOUR CODE HERE

router.get('/token', (req, res, next) => {
  console.log(req.headers);
  if (req.headers.tokeme) {
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;
