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
const {
  verifyUser, checkVerification
} = require('./mod/verifyUser');

const id = 1;

// YOUR CODE HERE

router.use('/favorites', checkVerification);

router.get('/favorites', (req, res, next) => {
  console.log('passed verification for', req.cookies.token);
  knex('favorites')
    .where('favorites.user_id', id)
    .join('books', 'books.id', 'favorites.book_id')
    .then((results) => {
      res.send(camelizeKeys(results));
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

// router.get('/favorites/check?', checkVerification);

router.get('/favorites/check?', (req, res, next) => {
  console.log('passed verification for', req.cookies.token);
  const {
    bookId
  } = req.query;
  knex('favorites')
    .where('favorites.user_id', id)
    .join('books', 'books.id', 'favorites.book_id')
    .where('favorites.book_id', parseInt(bookId))
    .then((result) => {
      if (result[0]) {
        res.send(true);
      } else {
        res.send(false);
      }
    })
    .catch((err) =>{
      console.error(err);
      next(err);
    });
});

// router.post('/favorites', checkVerification);

router.post('/favorites/', (req, res, next) => {
  console.log('passed verification for', req.cookies.token);
  req.body['userId'] = id;
  const toInsert = decamelizeKeys(req.body);
  console.log(toInsert);
  knex('favorites')
    .insert(toInsert)
    .join('books', 'books.id', 'favorites.book_id')
    .where('favorites.book_id', parseInt(toInsert.bookId))
    .returning('*')
    .then((result) => {
      if (result[0]) {
        console.log(result);
        res.send(camelizeKeys(result[0]));
      }
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

// router.delete('/favorites', checkVerification);

router.delete('/favorites/', (req, res, next) => {
  console.log('passed verification for', req.cookies.token);
  req.body['userId'] = id;
  const toDelete = decamelizeKeys(req.body);
  knex('favorites')
    .where(toDelete)
    .del()
    .returning(['book_id', 'user_id'])
    .then((result) => {
      if (result[0]) {
        console.log(result);
        res.send(camelizeKeys(result[0]));
      }
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

router.use((err, _req, res, next) => {
  console.log('ERROR', err);
  if (err === 200) {
    console.log('sending error 200');
    // res.set(200).send(false);
    next(boom.create(200, false));
  }
  if (err === 401) {
    console.log('sending error 401');
    // res.set(401).send('Unauthorized');
    next(boom.create(401, 'Unauthorized'));
  } else {
    next(boom.create(err));
  }
});

module.exports = router;
