// db/migrations/003_create_refresh_tokens.js
exports.up = async (knex) => {
  await knex.schema.createTable('refresh_tokens', (t) => {
    t.string('token').primary();
    t.string('store_slug').notNullable().references('slug').inTable('stores').onDelete('CASCADE');
    t.timestamp('expires_at').notNullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.raw('CREATE INDEX idx_refresh_tokens_slug ON refresh_tokens(store_slug)');
  await knex.schema.raw('CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at)');
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('refresh_tokens');
};
