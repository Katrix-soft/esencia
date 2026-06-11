const PLANS = [
  { id:'semilla', name:'Plan Semilla', price:11900, currency:'ARS', recommended:false, features:['Catálogo ilimitado','Subdominio propio (tu-marca.katrix.com.ar)','Panel de administración','Emails de onboarding automáticos','Soporte básico'] },
  { id:'flor',    name:'Plan Flor',    price:24900, currency:'ARS', recommended:true,  features:['Todo de Semilla','CRM de clientes','Estadísticas de ventas','Campañas por email','Soporte prioritario 24/7'] },
  { id:'extracto', name:'Plan Extracto', price:35000, currency:'ARS', recommended:false, features:['Todo de Flor','Asistente de IA Integrado','Analítica de Tendencias','Marketing Automatizado','Soporte prioritario 24/7'] }
];

const spec = {
  openapi:'3.0.0',
  info:{
    title:'Esencia SaaS — API Completa',
    version:'1.0.0',
    description:`
## 📚 Guía Educativa y Documentación Técnica de Esencia API

¡Bienvenido a la documentación de **Esencia API**! Este espacio está diseñado para que desarrolladores desde nivel Trainee hasta Senior comprendan rápidamente la arquitectura de nuestra plataforma SaaS de perfumería digital.

---

### 🌐 Arquitectura de Dominios e Infraestructura
* **Landing Page y Panel Admin**: \`https://esencia.katrix.com.ar\`
* **API y Swagger Docs**: \`https://api.katrix.com.ar/api/docs\`
* **Subdominios Dinámicos de Clientes**: \`http://{slug}.katrix.com.ar\` (ej: \`http://aromas-del-sur.katrix.com.ar\`)

---

### 🔄 1. Flujo de Onboarding de Clientes
Cuando un nuevo comerciante se registra y adquiere un plan, la aplicación sigue este pipeline en tiempo real:

\`\`\`mermaid
graph TD
    A[1. GET /plans: Cliente selecciona Plan] --> B[2. GET /config: Frontend carga Llave Pública MP]
    B --> C[3. POST /payments/create: Procesa Pago y Crea Cuenta]
    C -->|Si es Aprobado| D[4. Aprovisionamiento Automático en DB local]
    D --> E[5. Envío de Email de bienvenida con Clave Temporal]
    E --> F[6. Cliente accede a su tienda y panel en esencia.katrix.com.ar]
\`\`\`

---

### 🔑 2. Autenticación (Bearer Token)
Los endpoints que modifican o leen información confidencial (POST, PUT, DELETE sobre tiendas o productos) requieren autenticación mediante cabeceras HTTP estándares:

* **Header**: \`Authorization: Bearer <token_de_acceso>\`
* **Token en Producción y Desarrollo**: El valor del token debe ser **exactamente** el valor configurado en la variable de entorno \`WEBHOOK_SECRET\` en tu archivo \`.env\` o en Easypanel.

#### Ejemplo cURL de Endpoint Protegido:
\`\`\`bash
curl -H "Authorization: Bearer <TU_WEBHOOK_SECRET>" https://api.katrix.com.ar/api/stores
\`\`\`

---

### 🛡️ 3. Webhooks de Mercado Pago y Firma HMAC
Para proteger nuestro webhook contra fraudes (peticiones falsas simulando pagos aprobados), implementamos validación criptográfica HMAC SHA-256 usando el \`WEBHOOK_SECRET\` provisto por Mercado Pago:

1. **Mercado Pago envía dos cabeceras**:
   * \`x-signature\`: Contiene el timestamp (\`ts\`) y el hash de control (\`v1\`), ej: \`ts=1781137085,v1=74b56d773a29...\`
   * \`x-request-id\`: El identificador de la transacción.
2. **Construcción del Manifest**:
   El servidor concatena los datos recibidos en este formato exacto:
   \`id:{data.id};request-id:{x-request-id};ts:{ts};\`
3. **Validación**:
   Se calcula el HMAC SHA-256 de ese manifest usando el \`WEBHOOK_SECRET\`. Si coincide con el parámetro \`v1\` recibido, el pago es verídico y se procesa.

#### 🧪 Simular Webhook en Desarrollo (cURL):
\`\`\`bash
curl -X POST "http://localhost:3000/webhook?data.id=123456&type=order" \\
  -H "Content-Type: application/json" \\
  -H "x-request-id: req-test-123" \\
  -H "x-signature: ts=1781137085,v1=74b56d773a293ddbbd43eb166e47d7b7dc127c35f31526e0dc0057462161b019" \\
  -d '{"id": "123456", "type": "order"}'
\`\`\`

---

### 💾 4. Persistencia de Datos
* **Base de datos**: Usamos un motor embebido JSON ultra-rápido en \`stores-db.json\`.
* **Despliegue en Docker/Easypanel**: La base de datos se almacena dinámicamente en el directorio definido por la variable \`DATA_DIR\`. Para evitar pérdida de datos en despliegues automáticos, Easypanel monta un volumen persistente en el contenedor en la ruta \`/app/data\`.

---

### 🚀 5. Lista de Comandos Rápidos cURL (Copy-Paste)

#### Obtener Planes Disponibles:
\`\`\`bash
curl -s http://localhost:3000/api/plans
\`\`\`

#### Validar Estado de Salud del Backend y DB:
\`\`\`bash
curl -s http://localhost:3000/api/health
\`\`\`

#### Obtener Tienda por su Slug:
\`\`\`bash
curl -s http://localhost:3000/api/stores/aromas-del-sur
\`\`\`
    `,
    contact:{ name:'Katrix Dev', email:'igsrdev@katrix.com.ar', url:'https://esencia.katrix.com.ar' },
    license:{ name:'MIT' }
  },
  servers:[
    { url:'http://localhost:3000/api', description:'🔧 Desarrollo local' },
    { url:'https://api.katrix.com.ar/api', description:'🚀 Producción HTTPS' },
    { url:'http://api.katrix.com.ar:3000/api', description:'🚀 Producción Puerto 3000' }
  ],
  tags:[
    { name:'📋 Planes', description:'Planes de suscripción. Fuente de verdad centralizada — cambiar aquí actualiza toda la app.' },
    { name:'⚙️ Config', description:'Configuración del cliente. Provee la public_key de Mercado Pago para el Payment Brick.' },
    { name:'💳 Pagos', description:'Procesamiento de pagos con Mercado Pago Orders API (modo automático). Incluye provisioning de tienda y emails de onboarding.' },
    { name:'🔔 Webhooks', description:'Notificaciones IPN entrantes desde Mercado Pago. Siempre responde 200 para evitar reintentos.' },
    { name:'🏪 Tiendas', description:'CRUD de tiendas. Cada tienda tiene un slug único que se convierte en subdominio.' },
    { name:'📦 Productos', description:'Catálogo de productos de cada tienda. Endpoints para el panel admin y para la vista pública.' }
  ],
  components:{
    securitySchemes:{
      BearerAuth:{ type:'http', scheme:'bearer', bearerFormat:'JWT', description:'Token JWT obtenido al autenticarse en el panel admin.' }
    },
    schemas:{
      Plan:{
        type:'object',
        description:'Plan de suscripción mensual de Esencia',
        properties:{
          id:{ type:'string', enum:['semilla','flor'], example:'semilla', description:'Identificador único del plan' },
          name:{ type:'string', example:'Plan Semilla', description:'Nombre visible del plan' },
          price:{ type:'number', example:11900, description:'Precio mensual en ARS (pesos argentinos)' },
          currency:{ type:'string', example:'ARS', description:'Moneda (siempre ARS por ahora)' },
          recommended:{ type:'boolean', example:false, description:'Si está marcado como plan recomendado en el pricing' },
          features:{ type:'array', items:{ type:'string' }, example:['Catálogo ilimitado','Subdominio propio'], description:'Lista de características incluidas' }
        }
      },
      Store:{
        type:'object',
        description:'Tienda de un cliente en la plataforma Esencia',
        properties:{
          slug:{ type:'string', example:'aromas-del-sur', description:'Identificador único. Se convierte en subdominio: aromas-del-sur.katrix.com.ar' },
          name:{ type:'string', example:'Aromas del Sur', description:'Nombre público de la tienda' },
          description:{ type:'string', example:'Decants y perfumes de nicho con envío a todo el país' },
          phone:{ type:'string', example:'+54 11 1234-5678' },
          email:{ type:'string', format:'email', example:'contacto@aromasdelsur.com' },
          address:{ type:'string', example:'Av. Corrientes 1234, CABA' },
          storeUrl:{ type:'string', example:'http://aromas-del-sur.katrix.com.ar' },
          plan:{ type:'string', enum:['semilla','flor'], example:'semilla' },
          createdAt:{ type:'string', format:'date-time' }
        }
      },
      Product:{
        type:'object',
        description:'Producto del catálogo de una tienda',
        required:['name','brand','price'],
        properties:{
          id:{ type:'string', format:'uuid', description:'Generado automáticamente' },
          name:{ type:'string', example:'Black Orchid', description:'Nombre del perfume' },
          brand:{ type:'string', example:'Tom Ford', description:'Marca/casa' },
          category:{ type:'string', example:'Oriental', enum:['Oriental','Floral','Fresco','Amaderado','Cítrico','Gourmand','Acuático'], description:'Familia olfativa' },
          volume:{ type:'string', example:'10ml decant', description:'Presentación (ej: 5ml, 10ml decant, 100ml)' },
          price:{ type:'number', example:4500, description:'Precio en ARS' },
          stock:{ type:'integer', example:5, description:'Unidades disponibles. 0 = sin stock.' }
        }
      },
      PaymentRequest:{
        type:'object',
        required:['transaction_amount','payer'],
        description:'Payload para procesar un pago. Construido por el Payment Brick de Mercado Pago.',
        properties:{
          transaction_amount:{ type:'number', example:11900, description:'Monto total en ARS. Debe coincidir con el precio del plan.' },
          plan_name:{ type:'string', example:'Plan Semilla' },
          plan_price:{ type:'number', example:11900 },
          store_name:{ type:'string', example:'Aromas del Sur', description:'Nombre de la tienda que se va a crear' },
          store_slug:{ type:'string', example:'aromas-del-sur', description:'Slug generado automáticamente desde store_name' },
          token:{ type:'string', description:'Token de tarjeta generado por el SDK de MP. Obligatorio para pagos con tarjeta.' },
          payment_method_id:{ type:'string', example:'visa', description:'Identificador del medio de pago (visa, master, rapipago, pagofacil, etc.)' },
          payment_method_type:{ type:'string', enum:['credit_card','debit_card','ticket'], example:'credit_card' },
          installments:{ type:'integer', example:1, description:'Cuotas. Normalmente 1 para suscripciones.' },
          payer:{
            type:'object',
            required:['email'],
            properties:{
              first_name:{ type:'string', example:'María' },
              last_name:{ type:'string', example:'González' },
              email:{ type:'string', format:'email', example:'maria@gmail.com', description:'Email del cliente — se usa como usuario del panel admin' },
              identification:{ type:'object', properties:{ type:{ type:'string', example:'DNI' }, number:{ type:'string', example:'30111222' } } }
            }
          }
        }
      },
      PaymentResponse:{
        type:'object',
        description:'Respuesta del endpoint de pago cuando el pago fue aprobado',
        properties:{
          id:{ type:'string', example:'ORD-123456789', description:'ID de la Order en Mercado Pago' },
          status:{ type:'string', enum:['processed','approved','in_process','pending','rejected'], example:'processed' },
          status_detail:{ type:'string', example:'accredited' },
          tempPassword:{ type:'string', example:'Esencia_AB12CD', description:'Contraseña temporal generada para el panel admin. Se envía por email.' },
          storeUrl:{ type:'string', example:'http://aromas-del-sur.katrix.com.ar', description:'URL pública de la tienda recién creada' },
          storeSlug:{ type:'string', example:'aromas-del-sur' },
          storeName:{ type:'string', example:'Aromas del Sur' }
        }
      },
      Error:{
        type:'object',
        properties:{
          error:{ type:'string', example:'Tienda no encontrada' },
          details:{ type:'object' }
        }
      }
    }
  },
  paths:{
    '/health':{
      get:{
        tags:['⚙️ Config'],
        summary:'Verificar estado de la API (Health Check)',
        description:`Valida si la API de Esencia está en línea, su uptime actual y el estado de la persistencia de la base de datos local.
        
**Sin autenticación requerida.**`,
        responses:{
          200:{
            description:'API en línea y funcionando correctamente',
            content:{
              'application/json':{
                schema:{
                  type:'object',
                  properties:{
                    status:{ type:'string', example:'healthy' },
                    timestamp:{ type:'string', format:'date-time', example:'2026-06-11T00:00:00.000Z' },
                    uptime:{ type:'string', example:'145s' },
                    database:{ type:'string', example:'active (local json)' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/plans':{
      get:{
        tags:['📋 Planes'],
        summary:'Listar todos los planes',
        description:`Retorna los planes de suscripción activos con todos sus detalles.

**Uso en el frontend:** este endpoint es consumido por el componente \`PricingComponent\` para renderizar las cards de precios dinámicamente. Si querés cambiar un precio o agregar features, lo cambiás en \`api.js\` y se actualiza en toda la app automáticamente.

**Sin autenticación requerida.**`,
        responses:{
          200:{
            description:'Lista de planes ordenada de menor a mayor precio',
            content:{ 'application/json':{ schema:{ type:'array', items:{ '$ref':'#/components/schemas/Plan' } }, example:PLANS } }
          }
        }
      }
    },
    '/plans/{planId}':{
      get:{
        tags:['📋 Planes'],
        summary:'Obtener un plan específico',
        description:'Retorna los datos de un plan en particular. Útil cuando el frontend solo necesita el precio de un plan para pre-cargar el modal de pago.',
        parameters:[{ name:'planId', in:'path', required:true, schema:{ type:'string', enum:['semilla','flor'] }, example:'semilla', description:'ID del plan' }],
        responses:{
          200:{ description:'Datos del plan', content:{ 'application/json':{ schema:{ '$ref':'#/components/schemas/Plan' }, example:PLANS[0] } } },
          404:{ description:'Plan no encontrado', content:{ 'application/json':{ schema:{ '$ref':'#/components/schemas/Error' }, example:{ error:'Plan no encontrado' } } } }
        }
      }
    },
    '/config':{
      get:{
        tags:['⚙️ Config'],
        summary:'Obtener configuración del cliente',
        description:`Retorna la \`publicKey\` de Mercado Pago necesaria para inicializar el **Payment Brick** en el frontend.

⚠️ **Importante:** Este endpoint nunca expone el \`ACCESS_TOKEN\` privado. Solo devuelve la clave pública que puede ir en el cliente.

También incluye los planes disponibles para que el frontend pueda inicializar todo en un solo request.`,
        responses:{
          200:{
            description:'Configuración del cliente',
            content:{ 'application/json':{ example:{ publicKey:'APP_USR-7de37b05-xxxx', plans:PLANS } } }
          }
        }
      }
    },
    '/payments/create':{
      post:{
        tags:['💳 Pagos'],
        summary:'Procesar pago y provisionar tienda',
        description:`Endpoint principal del flujo de onboarding. Recibe los datos del **Payment Brick** de Mercado Pago y ejecuta todo el proceso de alta.

### Flujo interno
1. Mapea los datos al formato de la **Orders API** de Mercado Pago
2. Crea la Order con modo de procesamiento \`automatic\`
3. Si el pago es aprobado:
   - Genera una contraseña temporal única (\`Esencia_XXXXXX\`)
   - Guarda los archivos de email en \`/emails/\`
   - Si hay credenciales SMTP en \`.env\`, envía los emails reales:
     - **Email al cliente** con sus credenciales y link a la tienda
     - **Email interno** a \`igsrdev@katrix.com.ar\` con datos de aprovisionamiento
4. Retorna el \`storeUrl\`, \`tempPassword\` y datos de la Order

### También responde a
- \`POST /process_payment\` (legacy, mismo comportamiento)
- \`POST /api/pagos/v1/payments\` (endpoint alternativo)

### Medios de pago soportados
| Tipo | payment_method_type | Ejemplo de ID |
|------|---------------------|---------------|
| Tarjeta crédito | credit_card | visa, master, amex |
| Tarjeta débito  | debit_card  | visa_electron, maestro |
| Pago en efectivo | ticket | rapipago, pagofacil |
`,
        requestBody:{
          required:true,
          content:{
            'application/json':{
              schema:{ '$ref':'#/components/schemas/PaymentRequest' },
              examples:{
                tarjeta_credito:{
                  summary:'💳 Tarjeta de crédito Visa (caso más común)',
                  value:{
                    transaction_amount:11900, plan_name:'Plan Semilla', plan_price:11900,
                    store_name:'Aromas del Sur', store_slug:'aromas-del-sur',
                    token:'TEST-tokenGeneradoPorMP', payment_method_id:'visa',
                    payment_method_type:'credit_card', installments:1,
                    payer:{ first_name:'María', last_name:'González', email:'maria@gmail.com', identification:{ type:'DNI', number:'30111222' } }
                  }
                },
                efectivo:{
                  summary:'🏪 Pago en efectivo (Rapipago)',
                  value:{
                    transaction_amount:11900, plan_name:'Plan Semilla', plan_price:11900,
                    store_name:'Mis Fragancias', store_slug:'mis-fragancias',
                    payment_method_id:'rapipago', payment_method_type:'ticket',
                    payer:{ first_name:'Carlos', last_name:'Ruiz', email:'carlos@hotmail.com', identification:{ type:'DNI', number:'25333444' } }
                  }
                },
                plan_flor:{
                  summary:'🌸 Plan Flor con Mastercard',
                  value:{
                    transaction_amount:24900, plan_name:'Plan Flor', plan_price:24900,
                    store_name:'Niche Decants BA', store_slug:'niche-decants-ba',
                    token:'TEST-otroTokenMP', payment_method_id:'master',
                    payment_method_type:'credit_card', installments:1,
                    payer:{ first_name:'Laura', last_name:'Vega', email:'laura@gmail.com', identification:{ type:'DNI', number:'28777999' } }
                  }
                }
              }
            }
          }
        },
        responses:{
          201:{
            description:'✅ Pago aprobado y tienda provisionada',
            content:{ 'application/json':{ schema:{ '$ref':'#/components/schemas/PaymentResponse' }, example:{ id:'ORD-12345', status:'processed', tempPassword:'Esencia_AB12CD', storeUrl:'http://aromas-del-sur.katrix.com.ar', storeSlug:'aromas-del-sur', storeName:'Aromas del Sur' } } }
          },
          500:{ description:'❌ Error al procesar el pago (token inválido, saldo insuficiente, error de red)', content:{ 'application/json':{ schema:{ '$ref':'#/components/schemas/Error' } } } }
        }
      }
    },
    '/webhook':{
      post:{
        tags:['🔔 Webhooks'],
        summary:'Recibir notificaciones de Mercado Pago (IPN)',
        description:`Endpoint que Mercado Pago llama cuando cambia el estado de una Order o pago.

### Configuración en el Panel de MP
- **URL:** \`https://api.katrix.com.ar/webhook\`
- **Eventos a suscribir:** \`Orders\`

### Validación de firma HMAC
Si \`WEBHOOK_SECRET\` está configurado en \`.env\`, el servidor valida la autenticidad del webhook:
\`\`\`
x-signature: ts=1234567890,v1=abc123...
x-request-id: req-uuid-aqui
\`\`\`

El servidor recalcula el HMAC y lo compara. Si falla la validación, se loguea la advertencia pero **no rechaza el request** para evitar perder eventos.

### Respuesta siempre 200
MP reintenta el webhook si no recibe 200. Por eso siempre respondemos \`200\` incluso si hay errores internos.`,
        parameters:[
          { name:'x-signature', in:'header', schema:{ type:'string' }, description:'Firma HMAC generada por MP. Formato: ts=TIMESTAMP,v1=HASH' },
          { name:'x-request-id', in:'header', schema:{ type:'string', format:'uuid' }, description:'ID único del request de MP' }
        ],
        requestBody:{
          content:{
            'application/json':{
              examples:{
                order_update:{ summary:'Order actualizada', value:{ action:'order.updated', api_version:'v1', data:{ id:'ORD-12345' }, type:'order', date_created:'2024-01-15T10:30:00Z' } },
                payment_update:{ summary:'Pago actualizado', value:{ action:'payment.updated', data:{ id:'PAY-67890' }, type:'payment' } }
              }
            }
          }
        },
        responses:{
          200:{ description:'Recibido (siempre)', content:{ 'application/json':{ example:{ status:'recibido' } } } }
        }
      }
    },
    '/stores/{slug}':{
      get:{
        tags:['🏪 Tiendas'],
        summary:'Obtener info pública de una tienda',
        description:`Retorna los datos públicos de la tienda. Este endpoint es consumido por la vista pública \`slug.katrix.com.ar\` para mostrar el nombre, descripción y datos de contacto.

**Sin autenticación requerida.**`,
        parameters:[{ name:'slug', in:'path', required:true, schema:{ type:'string' }, example:'aromas-del-sur' }],
        responses:{
          200:{ description:'Datos de la tienda', content:{ 'application/json':{ schema:{ '$ref':'#/components/schemas/Store' } } } },
          404:{ description:'Tienda no encontrada' }
        }
      },
      put:{
        tags:['🏪 Tiendas'],
        summary:'Actualizar configuración de la tienda',
        description:'Actualiza los datos de la tienda desde el panel de administración. Requiere autenticación.',
        security:[{ BearerAuth:[] }],
        parameters:[{ name:'slug', in:'path', required:true, schema:{ type:'string' } }],
        requestBody:{ required:true, content:{ 'application/json':{ schema:{ '$ref':'#/components/schemas/Store' }, example:{ name:'Aromas del Sur', description:'Los mejores decants de nicho', phone:'+54 11 5555-0000', email:'hola@aromasdelsur.com', address:'Palermo, CABA' } } } },
        responses:{
          200:{ description:'Tienda actualizada', content:{ 'application/json':{ schema:{ '$ref':'#/components/schemas/Store' } } } },
          401:{ description:'No autorizado' },
          404:{ description:'Tienda no encontrada' }
        }
      }
    },
    '/stores/{slug}/products':{
      get:{
        tags:['📦 Productos'],
        summary:'Listar productos del catálogo',
        description:`Retorna todos los productos del catálogo de la tienda.

**Filtros disponibles:**
- \`?category=Oriental\` — filtra por familia olfativa
- \`?inStock=true\` — solo productos con stock disponible

**Sin autenticación requerida** (catálogo público).`,
        parameters:[
          { name:'slug', in:'path', required:true, schema:{ type:'string' }, example:'aromas-del-sur' },
          { name:'category', in:'query', schema:{ type:'string', enum:['Oriental','Floral','Fresco','Amaderado','Cítrico','Gourmand','Acuático'] }, description:'Filtrar por familia olfativa' },
          { name:'inStock', in:'query', schema:{ type:'boolean' }, description:'Solo mostrar productos con stock > 0' }
        ],
        responses:{
          200:{ description:'Lista de productos', content:{ 'application/json':{ schema:{ type:'array', items:{ '$ref':'#/components/schemas/Product' } }, example:[{ id:'uuid-1', name:'Black Orchid', brand:'Tom Ford', category:'Oriental', volume:'10ml decant', price:4500, stock:3 },{ id:'uuid-2', name:'Baccarat Rouge 540', brand:'Maison Francis Kurkdjian', category:'Oriental', volume:'5ml decant', price:6200, stock:0 }] } } }
        }
      },
      post:{
        tags:['📦 Productos'],
        summary:'Agregar producto al catálogo',
        description:'Agrega un nuevo producto al catálogo de la tienda desde el panel de administración.',
        security:[{ BearerAuth:[] }],
        parameters:[{ name:'slug', in:'path', required:true, schema:{ type:'string' } }],
        requestBody:{ required:true, content:{ 'application/json':{ schema:{ '$ref':'#/components/schemas/Product' }, example:{ name:'Sauvage Elixir', brand:'Dior', category:'Amaderado', volume:'10ml decant', price:5800, stock:8 } } } },
        responses:{
          201:{ description:'Producto creado con ID asignado', content:{ 'application/json':{ schema:{ '$ref':'#/components/schemas/Product' } } } },
          401:{ description:'No autorizado' }
        }
      }
    },
    '/stores/{slug}/products/{productId}':{
      put:{
        tags:['📦 Productos'],
        summary:'Actualizar un producto existente',
        description:'Modifica los datos de un producto. Útil para actualizar stock, precio o descripción desde el panel admin.',
        security:[{ BearerAuth:[] }],
        parameters:[
          { name:'slug', in:'path', required:true, schema:{ type:'string' } },
          { name:'productId', in:'path', required:true, schema:{ type:'string', format:'uuid' } }
        ],
        requestBody:{ required:true, content:{ 'application/json':{ schema:{ '$ref':'#/components/schemas/Product' }, example:{ price:5000, stock:10 } } } },
        responses:{
          200:{ description:'Producto actualizado', content:{ 'application/json':{ schema:{ '$ref':'#/components/schemas/Product' } } } },
          404:{ description:'Producto no encontrado' }
        }
      },
      delete:{
        tags:['📦 Productos'],
        summary:'Eliminar un producto',
        description:'Elimina permanentemente un producto del catálogo.',
        security:[{ BearerAuth:[] }],
        parameters:[
          { name:'slug', in:'path', required:true, schema:{ type:'string' } },
          { name:'productId', in:'path', required:true, schema:{ type:'string', format:'uuid' } }
        ],
        responses:{
          204:{ description:'Producto eliminado (sin contenido)' },
          404:{ description:'Producto no encontrado' }
        }
      }
    }
  }
};

module.exports = { spec, PLANS };
