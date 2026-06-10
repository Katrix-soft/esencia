const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// ============================================================
// SWAGGER SPEC
// ============================================================
const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Esencia SaaS API',
    version: '1.0.0',
    description: `
# Esencia API — Plataforma de tiendas de perfumería online

Esta API permite gestionar todo el ciclo de vida de una tienda Esencia:
- **Planes** disponibles y precios
- **Pagos** vía Mercado Pago (Orders API)
- **Tiendas** — creación, consulta y configuración
- **Productos** del catálogo de cada tienda
- **Onboarding** — provisioning automático post-pago
- **Webhooks** de Mercado Pago

## Autenticación
Los endpoints de administración requieren el header:
\`\`\`
X-API-Key: <tu-api-key>
\`\`\`
Los endpoints públicos (planes, tienda) no requieren autenticación.

## Subdominio de tiendas
Cada tienda recibe un subdominio único: \`slug.katrix.online\`
    `,
    contact: { name: 'Katrix', email: 'igsrdev@katrix.com.ar' }
  },
  servers: [
    { url: 'http://localhost:3000/api', description: 'Desarrollo local' },
    { url: 'https://katrix.online/api', description: 'Producción' }
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key'
      }
    },
    schemas: {
      Plan: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'semilla' },
          name: { type: 'string', example: 'Plan Semilla' },
          price: { type: 'number', example: 11900 },
          currency: { type: 'string', example: 'ARS' },
          features: { type: 'array', items: { type: 'string' } },
          recommended: { type: 'boolean' }
        }
      },
      Store: {
        type: 'object',
        properties: {
          slug: { type: 'string', example: 'mi-perfumeria' },
          name: { type: 'string', example: 'Mi Perfumería' },
          description: { type: 'string' },
          phone: { type: 'string' },
          email: { type: 'string', format: 'email' },
          address: { type: 'string' },
          storeUrl: { type: 'string', example: 'http://mi-perfumeria.katrix.online' }
        }
      },
      Product: {
        type: 'object',
        required: ['name', 'brand', 'price'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string', example: 'Black Orchid' },
          brand: { type: 'string', example: 'Tom Ford' },
          category: { type: 'string', example: 'Oriental' },
          volume: { type: 'string', example: '10ml decant' },
          price: { type: 'number', example: 4500 },
          stock: { type: 'integer', example: 5 }
        }
      },
      PaymentRequest: {
        type: 'object',
        required: ['transaction_amount', 'payer'],
        properties: {
          transaction_amount: { type: 'number', example: 11900 },
          plan_name: { type: 'string', example: 'Plan Semilla' },
          plan_price: { type: 'number', example: 11900 },
          store_name: { type: 'string', example: 'Mi Perfumería' },
          store_slug: { type: 'string', example: 'mi-perfumeria' },
          token: { type: 'string', description: 'Card token generado por el Payment Brick de MP' },
          payment_method_id: { type: 'string', example: 'visa' },
          payment_method_type: { type: 'string', enum: ['credit_card', 'debit_card', 'ticket'] },
          installments: { type: 'integer', example: 1 },
          payer: {
            type: 'object',
            properties: {
              first_name: { type: 'string' },
              last_name: { type: 'string' },
              email: { type: 'string', format: 'email' },
              identification: {
                type: 'object',
                properties: {
                  type: { type: 'string', example: 'DNI' },
                  number: { type: 'string', example: '12345678' }
                }
              }
            }
          }
        }
      },
      PaymentResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'ID de la Order en Mercado Pago' },
          status: { type: 'string', enum: ['processed', 'approved', 'in_process', 'pending', 'rejected'] },
          tempPassword: { type: 'string', example: 'Esencia_AB12CD' },
          storeUrl: { type: 'string', example: 'http://mi-perfumeria.katrix.online' },
          storeSlug: { type: 'string', example: 'mi-perfumeria' },
          storeName: { type: 'string', example: 'Mi Perfumería' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          details: { type: 'object' }
        }
      }
    }
  },
  paths: {
    '/plans': {
      get: {
        tags: ['Planes'],
        summary: 'Listar todos los planes disponibles',
        description: 'Retorna los planes de suscripción activos con precios y features. Útil para renderizar la sección de pricing en el frontend.',
        responses: {
          200: {
            description: 'Lista de planes',
            content: {
              'application/json': {
                schema: { type: 'array', items: { '$ref': '#/components/schemas/Plan' } },
                example: [
                  { id: 'semilla', name: 'Plan Semilla', price: 11900, currency: 'ARS', features: ['Catálogo ilimitado', 'Subdominio propio', 'Panel admin', 'Soporte básico'], recommended: false },
                  { id: 'flor', name: 'Plan Flor', price: 24900, currency: 'ARS', features: ['Todo de Semilla', 'CRM integrado', 'Estadísticas', 'Soporte prioritario', 'Emails automáticos'], recommended: true }
                ]
              }
            }
          }
        }
      }
    },
    '/plans/{planId}': {
      get: {
        tags: ['Planes'],
        summary: 'Obtener un plan por ID',
        parameters: [{ name: 'planId', in: 'path', required: true, schema: { type: 'string', enum: ['semilla', 'flor'] } }],
        responses: {
          200: { description: 'Datos del plan', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Plan' } } } },
          404: { description: 'Plan no encontrado' }
        }
      }
    },
    '/config': {
      get: {
        tags: ['Configuración'],
        summary: 'Obtener clave pública de Mercado Pago',
        description: 'Retorna la `public_key` de MP para inicializar el Payment Brick en el frontend. Nunca expone el Access Token.',
        responses: {
          200: {
            description: 'Public key de MP',
            content: {
              'application/json': {
                example: { publicKey: 'APP_USR-xxxxxxxx' }
              }
            }
          }
        }
      }
    },
    '/payments/create': {
      post: {
        tags: ['Pagos'],
        summary: 'Procesar un pago vía Mercado Pago Orders API',
        description: `
Recibe los datos del Payment Brick de Mercado Pago y crea una Order.

**Flujo completo:**
1. El frontend inicializa el Payment Brick con la \`publicKey\` de \`GET /api/config\`
2. El usuario completa los datos de pago y MP devuelve un \`token\`
3. El frontend envía ese token junto con los datos del plan y cliente a este endpoint
4. El backend crea la Order en MP y, si es aprobada, provisiona la tienda
5. Se generan y envían los emails de onboarding

**Notas:**
- Para pagos con tarjeta, \`token\` es obligatorio
- Para tickets (Rapipago/PagoFácil), \`payment_method_id\` es el identificador del medio
        `,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { '$ref': '#/components/schemas/PaymentRequest' },
              examples: {
                tarjeta: {
                  summary: 'Pago con tarjeta de crédito',
                  value: {
                    transaction_amount: 11900,
                    plan_name: 'Plan Semilla',
                    plan_price: 11900,
                    store_name: 'Aromas del Sur',
                    store_slug: 'aromas-del-sur',
                    token: 'abc123tokenMP',
                    payment_method_id: 'visa',
                    payment_method_type: 'credit_card',
                    installments: 1,
                    payer: {
                      first_name: 'María',
                      last_name: 'González',
                      email: 'maria@gmail.com',
                      identification: { type: 'DNI', number: '30111222' }
                    }
                  }
                },
                ticket: {
                  summary: 'Pago con ticket (Rapipago)',
                  value: {
                    transaction_amount: 11900,
                    plan_name: 'Plan Semilla',
                    plan_price: 11900,
                    store_name: 'Mis Fragancias',
                    store_slug: 'mis-fragancias',
                    payment_method_id: 'rapipago',
                    payment_method_type: 'ticket',
                    payer: {
                      first_name: 'Carlos',
                      last_name: 'Ruiz',
                      email: 'carlos@hotmail.com',
                      identification: { type: 'DNI', number: '25333444' }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Pago procesado exitosamente',
            content: { 'application/json': { schema: { '$ref': '#/components/schemas/PaymentResponse' } } }
          },
          500: { description: 'Error al procesar el pago', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } }
        }
      }
    },
    '/webhook': {
      post: {
        tags: ['Webhooks'],
        summary: 'Endpoint de notificaciones de Mercado Pago',
        description: `
Recibe notificaciones IPN de Mercado Pago cuando cambia el estado de un pago o order.

**Configuración en el panel MP:**
- URL: \`https://katrix.online/api/webhook\`
- Eventos: \`order\`, \`payment\`

**Seguridad:**
El servidor valida la firma HMAC enviada en el header \`x-signature\` usando el \`WEBHOOK_SECRET\` configurado en \`.env\`.

**Siempre responde 200** para evitar reintentos de MP aunque haya error interno.
        `,
        parameters: [
          { name: 'x-signature', in: 'header', schema: { type: 'string' }, description: 'Firma HMAC de MP' },
          { name: 'x-request-id', in: 'header', schema: { type: 'string' } }
        ],
        requestBody: {
          content: {
            'application/json': {
              example: { action: 'order.updated', data: { id: 'ORDER_123' }, type: 'order' }
            }
          }
        },
        responses: {
          200: { description: 'Recibido', content: { 'application/json': { example: { status: 'recibido' } } } }
        }
      }
    },
    '/stores/{slug}': {
      get: {
        tags: ['Tiendas'],
        summary: 'Obtener info pública de una tienda',
        description: 'Retorna los datos públicos de la tienda accesible en `slug.katrix.online`.',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' }, example: 'mi-perfumeria' }],
        responses: {
          200: { description: 'Info de la tienda', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Store' } } } },
          404: { description: 'Tienda no encontrada' }
        }
      },
      put: {
        tags: ['Tiendas'],
        summary: 'Actualizar configuración de la tienda',
        security: [{ ApiKeyAuth: [] }],
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { '$ref': '#/components/schemas/Store' } } }
        },
        responses: {
          200: { description: 'Tienda actualizada' },
          401: { description: 'No autorizado' },
          404: { description: 'Tienda no encontrada' }
        }
      }
    },
    '/stores/{slug}/products': {
      get: {
        tags: ['Productos'],
        summary: 'Listar productos del catálogo',
        description: 'Retorna todos los productos del catálogo de la tienda especificada. Es el endpoint que consume la vista pública `slug.katrix.online`.',
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filtrar por categoría (Oriental, Floral, Fresco, etc.)' },
          { name: 'inStock', in: 'query', schema: { type: 'boolean' }, description: 'Solo mostrar productos con stock' }
        ],
        responses: {
          200: {
            description: 'Lista de productos',
            content: {
              'application/json': {
                schema: { type: 'array', items: { '$ref': '#/components/schemas/Product' } }
              }
            }
          }
        }
      },
      post: {
        tags: ['Productos'],
        summary: 'Agregar producto al catálogo',
        security: [{ ApiKeyAuth: [] }],
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { '$ref': '#/components/schemas/Product' },
              example: { name: 'Black Orchid', brand: 'Tom Ford', category: 'Oriental', volume: '10ml decant', price: 4500, stock: 5 }
            }
          }
        },
        responses: {
          201: { description: 'Producto creado', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Product' } } } },
          401: { description: 'No autorizado' }
        }
      }
    },
    '/stores/{slug}/products/{productId}': {
      put: {
        tags: ['Productos'],
        summary: 'Actualizar un producto',
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'productId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: { required: true, content: { 'application/json': { schema: { '$ref': '#/components/schemas/Product' } } } },
        responses: {
          200: { description: 'Producto actualizado' },
          404: { description: 'Producto no encontrado' }
        }
      },
      delete: {
        tags: ['Productos'],
        summary: 'Eliminar un producto',
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'productId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          204: { description: 'Eliminado' },
          404: { description: 'Producto no encontrado' }
        }
      }
    }
  },
  tags: [
    { name: 'Planes', description: 'Planes de suscripción disponibles en Esencia' },
    { name: 'Configuración', description: 'Configuración del cliente (claves públicas, etc.)' },
    { name: 'Pagos', description: 'Procesamiento de pagos con Mercado Pago Orders API' },
    { name: 'Webhooks', description: 'Notificaciones entrantes de Mercado Pago' },
    { name: 'Tiendas', description: 'Gestión de tiendas de clientes' },
    { name: 'Productos', description: 'Catálogo de productos de cada tienda' }
  ]
};

// ============================================================
// SWAGGER HTML TEMPLATE
// ============================================================
const swaggerHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Esencia API — Documentación</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css">
  <style>
    body { margin: 0; }
    .topbar { background: #1a1a2e !important; }
    .topbar .download-url-wrapper { display: none; }
    .info .title { color: #2d6a4f; }
    .btn.authorize { border-color: #2d6a4f; color: #2d6a4f; }
    .btn.authorize svg { fill: #2d6a4f; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      spec: __SWAGGER_SPEC__,
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
      layout: 'BaseLayout',
      deepLinking: true,
      tryItOutEnabled: true
    });
  </script>
</body>
</html>`;

// ============================================================
// PLANES — definición centralizada (fuente de verdad)
// ============================================================
const PLANS = [
  {
    id: 'semilla',
    name: 'Plan Semilla',
    price: 11900,
    currency: 'ARS',
    recommended: false,
    features: [
      'Catálogo ilimitado de productos',
      'Subdominio propio (tu-marca.katrix.online)',
      'Panel de administración completo',
      'Emails automáticos de onboarding',
      'Soporte básico por email'
    ]
  },
  {
    id: 'flor',
    name: 'Plan Flor',
    price: 24900,
    currency: 'ARS',
    recommended: true,
    features: [
      'Todo lo incluido en Semilla',
      'CRM de clientes integrado',
      'Estadísticas de ventas',
      'Integración con redes sociales',
      'Emails automáticos de reposición',
      'Soporte prioritario 24/7'
    ]
  }
];

// ============================================================
// RUTAS DE DOCS
// ============================================================
router.get('/docs', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(swaggerHtml.replace('__SWAGGER_SPEC__', JSON.stringify(swaggerSpec)));
});

router.get('/spec.json', (req, res) => {
  res.json(swaggerSpec);
});

// ============================================================
// RUTAS DE PLANES
// ============================================================
router.get('/plans', (req, res) => {
  res.json(PLANS);
});

router.get('/plans/:planId', (req, res) => {
  const plan = PLANS.find(p => p.id === req.params.planId);
  if (!plan) return res.status(404).json({ error: 'Plan no encontrado' });
  res.json(plan);
});

// ============================================================
// CONFIGURACION
// ============================================================
router.get('/config', (req, res) => {
  res.json({
    publicKey: process.env.MERCADOPAGO_PUBLIC_KEY || '',
    plans: PLANS
  });
});

// ============================================================
// TIENDAS (stub — en producción conectar a BD)
// ============================================================
const storesDB = {};

router.get('/stores/:slug', (req, res) => {
  const store = storesDB[req.params.slug];
  if (!store) return res.status(404).json({ error: 'Tienda no encontrada' });
  res.json(store);
});

router.put('/stores/:slug', (req, res) => {
  const { slug } = req.params;
  if (!storesDB[slug]) return res.status(404).json({ error: 'Tienda no encontrada' });
  storesDB[slug] = { ...storesDB[slug], ...req.body };
  res.json(storesDB[slug]);
});

// ============================================================
// PRODUCTOS (stub — en producción conectar a BD)
// ============================================================
router.get('/stores/:slug/products', (req, res) => {
  const store = storesDB[req.params.slug];
  if (!store) return res.status(404).json({ error: 'Tienda no encontrada' });
  let products = store.products || [];
  if (req.query.category) products = products.filter(p => p.category === req.query.category);
  if (req.query.inStock === 'true') products = products.filter(p => p.stock > 0);
  res.json(products);
});

router.post('/stores/:slug/products', (req, res) => {
  const store = storesDB[req.params.slug];
  if (!store) return res.status(404).json({ error: 'Tienda no encontrada' });
  const product = { ...req.body, id: crypto.randomUUID() };
  store.products = [...(store.products || []), product];
  res.status(201).json(product);
});

router.put('/stores/:slug/products/:productId', (req, res) => {
  const store = storesDB[req.params.slug];
  if (!store) return res.status(404).json({ error: 'Tienda no encontrada' });
  const idx = (store.products || []).findIndex(p => p.id === req.params.productId);
  if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
  store.products[idx] = { ...store.products[idx], ...req.body };
  res.json(store.products[idx]);
});

router.delete('/stores/:slug/products/:productId', (req, res) => {
  const store = storesDB[req.params.slug];
  if (!store) return res.status(404).json({ error: 'Tienda no encontrada' });
  store.products = (store.products || []).filter(p => p.id !== req.params.productId);
  res.status(204).send();
});

// ============================================================
// PROVISIONING INTERNO (llamado desde server.js post-pago)
// ============================================================
router.provisionStore = function(slug, name, email, products) {
  storesDB[slug] = {
    slug,
    name,
    email,
    description: '',
    phone: '',
    address: '',
    storeUrl: `http://${slug}.katrix.online`,
    products: products || []
  };
  return storesDB[slug];
};

router.swaggerSpec = swaggerSpec;
router.PLANS = PLANS;

module.exports = router;

