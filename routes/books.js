'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE

const knex = require('../knex');

const {
  camelizeKeys,
  decamelizeKeys
} = require('humps');

const boom = require('boom');

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
    next(boom.create(404));
  } else {
    knex('books')
      .where('books.id', parseInt(req.params.id))
      .first()
      .then((book) => {
        if (!book) {
          next(boom.create(404));
        }
        res.send(camelizeKeys(book));
      })
      .catch((err) => {
        next(err);
      });
  }
});

router.post('/books', (req, res, next) => {
  let returnFields = {
    title: 'Title',
    author: 'Author',
    genre: 'Genre',
    description: 'Description',
    cover_url: 'Cover URL'
  };

  let insertion = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.coverUrl
  };

  for (let value in insertion) {
    switch (insertion[value]) {
    case (undefined):
      {
        next(boom.create(400, `${returnFields[value]} must not be blank`));
      }
    }
  }

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
  let id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next();
  }

  knex('books')
    .where('books.id', id)
    .first()
    .then((val) => {
      if (!val) {
        return next();
      } else if (!req.body) {
        return next(boom.create(400));
      } else {
        const replacement = decamelizeKeys(req.body);

        knex('books')
          .where('books.id', id)
          .update(replacement, '*')
          .then((updatedRow) => {
            res.send(camelizeKeys(updatedRow[0]));
          })
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      return next(err);
    });
});

router.delete('/books/:id', (req, res, next) => {
  let id = parseInt(req.params.id);

  if (isNaN(id)) {
    next();
  }

  knex('books')
    .where('books.id', id)
    .del()
    .returning('*')
    .then((deletedRow) => {
      if (!deletedRow[0]) {
        return next();
      }
      delete deletedRow[0].id;
      res.send(camelizeKeys(deletedRow[0]));
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
