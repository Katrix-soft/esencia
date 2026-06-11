// db/migrations/004_create_store_webhooks.js
exports.up = async (knex) => {
  await knex.schema.createTable('store_webhooks', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('store_slug').notNullable().references('slug').inTable('stores').onDelete('CASCADE');
    t.string('url').notNullable();
    t.specificType('events', 'text[]').defaultTo(knex.raw("'{payment.paid,payment.overdue}'"));
    t.boolean('active').defaultTo(true);
    t.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('store_webhooks');
};
