'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

const boom = require('boom');
const knex = require('../knex');
const {
  camelizeKeys,
  decamelizeKeys
} = require('humps');
const {
  checkVerification
} = require('./mod/verifyUser');

const id = 1;

// YOUR CODE HERE

router.use('/favorites', checkVerification);

router.get('/favorites', (req, res, next) => {
  knex('favorites')
    .where('favorites.user_id', id)
    .join('books', 'books.id', 'favorites.book_id')
    .then((results) => {
      res.send(camelizeKeys(results));
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/favorites/check?', (req, res, next) => {
  const bookId=parseInt(req.query.bookId);

  if (!checkBookId(bookId)) {
    next(400);
  }

  knex('favorites')
    .where('favorites.user_id', id)
    .join('books', 'books.id', 'favorites.book_id')
    .where('favorites.book_id', bookId)
    .then((result) => {
      if (result[0]) {
        res.send(true);
      }
      else {
        res.send(false);
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/favorites/', (req, res, next) => {
  req.body['userId'] = id;
  const toInsert = decamelizeKeys(req.body);

  if (!checkBookId(toInsert.book_id)) {
    next(400);
  }

  knex('favorites')
    .insert(toInsert)
    .join('books', 'books.id', 'favorites.book_id')
    .where('favorites.book_id', parseInt(toInsert.book_id))
    .returning('*')
    .then((result) => {
      if (result[0]) {
        res.send(camelizeKeys(result[0]));
      }
      else {
        next();
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/favorites/', (req, res, next) => {
  req.body['userId'] = id;
  const toDelete = decamelizeKeys(req.body);

  if (!checkBookId(toDelete.book_id)) {
    next(400);
  }

  knex('favorites')
    .where(toDelete)
    .del()
    .returning(['book_id', 'user_id'])
    .then((result) => {
      if (result[0]) {
        res.send(camelizeKeys(result[0]));
      }
      else {
        next('404F');
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.use((err, _req, _res, next) => {
  if (err.code === '23503') {
    next(boom.create(404, 'Book not found'));
  }
  switch (err) {
    case 200: {
      next(boom.create(200, false));
      break;
    }
    case 400: {
      next(boom.create(400, 'Book ID must be an integer'));
      break;
    }
    case 401: {
      next(boom.create(401, 'Unauthorized'));
      break;
    }
    case '404F': {
      next(boom.create(404, 'Favorite not found'));
      break;
    }
    default: {
      next();
    }
  }
});

function checkBookId(bookId) {
  if (typeof bookId !== 'number' || isNaN(bookId)) {
    return false;
  }

  return true;
}

module.exports = router;
