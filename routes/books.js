'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE

module.exports = router;

const knex = require('../knex');

const {
  camelizeKeys,
  decamelizeKeys
} = require('humps');

router.get('/books', (_req, res, next) => {
  knex('books').orderBy('title')
    .then((books) => {
      res.send(camelizeKeys(books));
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
  let id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.sendStatus(400);
  } else {
    knex('books')
      .where('books.id', parseInt(req.params.id))
      .first()
      .then((book) => {
        res.send(camelizeKeys(book));
      })
      .catch((err) => {
        next(err);
      });
  }
});

router.post('/books', (req, res, next) => {
  let insertion = decamelizeKeys(req.body);
  knex('books')
    .insert(insertion, '*')
    .then((newRow) => {
      res.send(camelizeKeys(newRow[0]));
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/books/:id', (req, res, next) => {
  let replacement = decamelizeKeys(req.body);
  knex('books')
    .where('books.id', parseInt(req.params.id))
    .update(replacement, '*')
    .then((updatedRow) => {
      res.send(camelizeKeys(updatedRow[0]));
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/books/:id', (req, res, next) => {
  knex('books')
    .where('books.id', parseInt(req.params.id))
    .del()
    .returning('*')
    .then((deletedRow) => {
      delete deletedRow[0].id;
      res.send(camelizeKeys(deletedRow[0]));
    })
    .catch((err) => {
      next(err);
    });
});
