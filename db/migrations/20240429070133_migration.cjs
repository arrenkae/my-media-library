exports.up = function(knex) {
    return knex.schema

    .createTable('users', function (table) {
        table.increments('id');
        table.string('username', 255).notNullable().unique();
        table.string('password', 500).notNullable();
    })

    .createTable('media', function (table) {
        table.increments('id');
        table.integer('user_id').notNullable();
        table.foreign('user_id').references('id').inTable('users');
        table.string('api_id', 50);
        table.string('title', 255).notNullable();
        table.string('type', 50).notNullable();
        table.string('image', 500);
        table.text('description');
        table.string('status', 50);
        table.boolean('released');
        table.integer('progress');
        table.integer('progress_max');
        table.integer('rating');
        table.string('release_date', 10);
        table.string('update_date', 10);
        table.datetime('user_update').defaultTo(knex.fn.now());
        table.string('author', 255);
        table.json('seasons');
    })
    .alterTable('media', function (table) {
        table.unique(['user_id', 'api_id', 'type']);
    })

};

exports.down = function(knex) {
    return knex.schema.dropTable('users').dropTable('media');
};

exports.config = { transaction: false };