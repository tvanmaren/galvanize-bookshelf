'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

const knex = require('../knex');

const {
  camelizeKeys,
  decamelizeKeys
} = require('humps');

const boom = require('boom');

const bcrypt = require('bcrypt-as-promised');

router.use('/users', (req, res, next) => { // request validation
  const userInfo = decamelizeKeys(req.body);

  if (!(userInfo.email)) {
    return next(boom.create(400, 'Email must not be blank'));
  }

  knex('users')
    .where('email', userInfo.email)
    .then((result) => {
      if (result[0]) {
        return next(boom.create(400, 'Email already exists'));
      }
      if (!(userInfo.password)) { // ||
        // (userInfo.password.length) !== 8) {
        return next(
          boom.create(400, 'Password must be at least 8 characters long')
        );
      }

      next();
    })
    .catch((err) => {
      next(boom.create(err));
    });
});

router.post('/users', (req, res, next) => { // request execution
  let userInfo = decamelizeKeys(req.body);
  const password = userInfo.password;

  delete userInfo.password;
  userInfo.hashed_password = '';

  knex('users')
    .insert(userInfo)
    .returning('id')
    .then((id) => {
      bcrypt.hash(password, 1, (_err, hash) => {
        knex('users')
          .where('id', parseInt(id[0]))
          .update('hashed_password', hash)
          .returning('*')
          .then((newRow) => {
            newRow = newRow[0];
            delete newRow.hashed_password;
            delete newRow.created_at;
            delete newRow.updated_at;
            res.send(camelizeKeys(newRow));
          });
      });
    })
    .catch((err) => {
      next(boom.create(err));
    });
});

module.exports = router;
