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

const bcrypt = require('bcrypt');

router.post('/users', (req, res, _next) => {
  let userInfo = decamelizeKeys(req.body);
  let password = userInfo.password;
  delete userInfo.password;
  userInfo.hashed_password = '';
  knex('users')
    .insert(userInfo)
    .returning('id')
    .then((id) => {
      bcrypt.hash(password, 1, function (err, hash) {
        knex('users')
          .where('id', parseInt(id[0]))
          .update('hashed_password', hash)
          .returning('*')
          .then((newRow) => {
            newRow=newRow[0];
            delete newRow.hashed_password;
            delete newRow.created_at;
            delete newRow.updated_at;
            res.send(camelizeKeys(newRow));
          });
      });
    });
});

module.exports = router;
