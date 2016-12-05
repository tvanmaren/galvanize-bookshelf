'use strict';

/* eslint-disable no-unused-vars*/

exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', (table) => {
    table.increments();

    table.integer('book_id')
    .notNullable()
    .index()
    .references('books.id')
    .onDelete('cascade');

    table.integer('user_id')
    .notNullable()
    .index()
    .references('users.id')
    .onDelete('cascade');

    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorites');
};
