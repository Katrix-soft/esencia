// db/migrations/002_create_products.js
exports.up = async (knex) => {
  await knex.schema.createTable('products', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('store_slug').notNullable().references('slug').inTable('stores').onDelete('CASCADE');
    t.string('name').notNullable();
    t.string('brand').defaultTo('');
    t.string('category').defaultTo('');
    t.decimal('price', 12, 2).notNullable().defaultTo(0);
    t.integer('stock').notNullable().defaultTo(0);
    t.string('volume').defaultTo('');
    t.string('image_url').defaultTo('');
    t.timestamps(true, true);
  });

  await knex.schema.raw('CREATE INDEX idx_products_store_slug ON products(store_slug)');
  await knex.schema.raw('CREATE INDEX idx_products_category ON products(category)');
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('products');
};
