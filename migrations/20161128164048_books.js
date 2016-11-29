'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', (table) => {
    table.increments();
    table.string('title').defaultTo('').notNullable();
    table.string('author').defaultTo('').notNullable();
    table.string('genre').defaultTo('').notNullable();
    table.text('description').defaultTo('').notNullable();
    table.text('cover_url').defaultTo('').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('books');
};
