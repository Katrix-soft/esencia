// db/migrations/001_create_stores.js
exports.up = async (knex) => {
  await knex.schema.createTable('stores', (t) => {
    t.string('slug').primary();
    t.string('name').notNullable();
    t.string('email').notNullable().unique();
    t.string('password_hash').notNullable();
    t.text('description').defaultTo('');
    t.string('phone').defaultTo('');
    t.string('address').defaultTo('');
    t.string('store_url').defaultTo('');
    t.string('plan_id').defaultTo('semilla');
    t.string('payment_status').defaultTo('paid');
    t.integer('visit_count').defaultTo(0);
    t.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('stores');
};
