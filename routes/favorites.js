'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const knex = require('../knex');
const {
  camelizeKeys,
  decamelizeKeys
} = require('humps');
const {verifyUser} = require('./mod/verifyMe');

const id=1;

// YOUR CODE HERE

router.get('/favorites', (req, res, next) => {
  knex('favorites')
  .where('favorites.user_id',id)
  .join('books','books.id','favorites.book_id')
  .then((results)=>{
    res.send(camelizeKeys(results));
  });
});

module.exports = router;
