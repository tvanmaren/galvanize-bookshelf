'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const knex = require('../knex');
const {
  camelizeKeys
} = require('humps');
const {
  verifyUser
} = require('./mod/verifyUser');

// YOUR CODE HERE

router.get('/token', (req, res, _next) => {
  let results;
  if (req.cookies.token) {
    results = verifyUser(req.cookies.token);
    res.set(results[0]).send(true); // send(results[1]);
  } else {
    results = [200, false];
    res.set(results[0]).send(results[1]);
  }
});

router.post('/token', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let hashed_password, id, first_name, last_name;

  if (typeof email==='undefined') {
    next('400E');
  }
  if (typeof password==='undefined') {
    next('400P');
  }
  if (email && password) {
    knex('users')
      .select(['hashed_password', 'id', 'first_name', 'last_name'])
      .where('users.email', email)
      .then((results = [{}]) => {
        [{
          hashed_password,
          id,
          first_name,
          last_name
        }] = results;
        if (typeof id !== 'undefined') {
          bcrypt.compare(password, hashed_password)
            .then(() => {

              const token = jwt.sign({
                id,
                first_name,
                last_name
              }, secret);

              res.cookie('token', token, {
                httpOnly: true,
              });

              return res.send(camelizeKeys({
                id,
                email,
                first_name,
                last_name
              }));
            })
            .catch((_err) => {
              next(400); //passwords not matching
            });
        } else {
          next(400);
        }
      }).catch((_err) => {
        next(400); // knex query failed
      });
  } else {
    next(400);
  }
});

router.delete('/token', (req, res, _next) => {
  if (req.cookies.token) {
    res.cookie('token', '', {
      expires: new Date()
    });
  }
  res.clearCookie('token', {
    path: '/token'
  });
  res.set(200).send(true);
});

router.use((err, _req, _res, next) => {
  switch (err) {
    case 400: {
      next(boom.create(400, 'Bad email or password'));
      break;
    }
    case '400E': {
      next(boom.create(400, 'Email must not be blank'));
      break;
    }
    case '400P': {
      next(boom.create(400, 'Password must not be blank'));
      break;
    }
    default: {
      next();
    }
  }
});

module.exports = router;
