# Bitácora de Desarrollo: Esencia

Este documento registra los hitos, decisiones técnicas y la evolución del desarrollo del proyecto **Esencia**, una landing page y suite SaaS inteligente para perfumerías con Angular 17.

---

## 📌 Hitos del Proyecto

### 1. Migración y Configuración Base de Angular 17
* **Objetivo:** Migrar la Landing Page estática original a un entorno SPA estructurado en Angular 17 utilizando componentes independientes (*standalone components*).
* **Acciones:**
  * Se configuraron los scripts y estilos de Tailwind CSS en `angular.json` para soportar el diseño responsivo.
  * Implementación del fondo interactivo basado en un shader WebGL (`shader-canvas`), utilizando ruido simplex de GLSL.
  * Configuración de animaciones fluidas basadas en scroll y detectadas por `IntersectionObserver` a través del servicio `ScrollRevealService`.

### 2. Diseño e Integración del Layout Principal
* **Objetivo:** Enriquecer la landing page con secciones de negocio de alta conversión.
* **Acciones:**
  * **Sección "Soluciones":** Creada e integrada para solventar enlaces rotos de navegación.
  * **Call-to-Action (CTA):** Se diseñó una sección de suscripción y contacto previa al footer.
  * **Prueba Social (Testimonios):** Carrusel interactivo de testimonios de clientes con animaciones dinámicas de contadores de datos.
  * **Showcase de la Aplicación:** Galería interactiva con pestañas deslizables para previsualizar los módulos clave: *Dashboard*, *CRM* y *Catálogo*.

### 3. Infraestructura y Dockerización
* **Objetivo:** Facilitar la portabilidad y despliegue del proyecto.
* **Acciones:**
  * Creación y refinamiento de un `Dockerfile` multi-stage.
  * Configuración de un servidor web Nginx (`nginx.conf`) para servir la aplicación Angular compilada en producción de manera óptima y ligera.

### 4. Flujo de Carrito y Checkout (E-commerce)
* **Objetivo:** Habilitar el flujo de compras de productos y suscripciones.
* **Acciones:**
  * Migración modular del flujo.
  * Persistencia del carrito en la sesión para sincronizar las vistas de catálogo, carrito y la página de envíos.
  * Cálculo dinámico y reactivo de subtotales, impuestos y costos de envío.

### 5. Integración de Pasarela de Pagos (Mercado Pago)
* **Objetivo:** Integrar cobros seguros e integrados dentro del sitio.
* **Acciones:**
  * **Backend (Node/Express):** Configuración del servidor proxy (`server.js`) utilizando la SDK oficial de Mercado Pago (`mercadopago`).
  * **Webhook de Notificaciones:** Ruta `/webhook` que recibe notificaciones de transacciones, realiza la validación de firma HMAC (seguridad criptográfica) y simula la actualización de estados en base de datos.
  * **Frontend (Card Payment Brick):** Carga del SDK cliente v2 en `index.html` y renderizado del componente nativo de tarjeta de crédito/débito en `PricingComponent`.
  * **Simulación de Éxito:** Uso de SweetAlert2 (`Swal`) en el frontend para mostrar el mensaje de pago procesado con éxito mostrando el ID de la transacción (`Order ID`), esencial para completar el proceso de homologación de Mercado Pago.
  * **Credenciales:** Configuración de claves unificadas en `.env` utilizando el prefijo moderno `APP_USR-` tanto para la clave pública como para el token de acceso.

---

## 🛠️ Estructura Tecnológica Actual

| Capa | Tecnología / Herramienta |
| :--- | :--- |
| **Framework Frontend** | Angular 17 (Standalone Components) |
| **Backend / Proxy** | Node.js + Express |
| **Estilos** | CSS puro con Variables de Diseño (*Design Tokens*) |
| **Base de Datos / Sesiones**| Persistencia en SessionStorage |
| **Pasarela de Pagos** | Mercado Pago SDK (Backend v2.0.15 + Frontend JS v2) |
| **Notificaciones y Alerts** | SweetAlert2 |
| **Despliegue / Contenedores**| Docker (Multi-stage) + Nginx |

---

### 6. Expansión de API REST, Panel Administrativo y Control de Facturación
* **Objetivo:** Formalizar la arquitectura del backend mediante endpoints REST, Swagger, flujo de login seguro y control de acceso por vencimiento de pago.
* **Acciones:**
  * **API REST y Documentación:** Creación de endpoints para planes, tiendas y productos con Swagger UI configurado en `/api/docs` para facilitar la adopción por nuevos programadores.
  * **Autenticación real en Backend:** Implementación de `POST /api/auth/login` validando credenciales contra `stores-db.json` y permitiendo el redireccionamiento directo al Dashboard de administración.
  * **Control de Facturación (Día 15):** Lógica que bloquea accesos y APIs con un error `402 Payment Required` para tiendas marcadas como `unpaid` a partir del día 16 de cada mes.
  * **Notificación y Pantalla de Suspensión:** Integración frontend en el Panel de Administración que alerta preventivamente (días 1 al 15) sobre el pago mensual, y bloquea con un overlay de suspensión interactivo (día 16+) permitiendo regularizar la cuenta directamente.
  * **Gestión de Credenciales (Nodemailer):** Implementación de utilidades seguras para el restablecimiento y cambio de contraseñas (`POST /api/stores/:slug/change-password`) enviando correos automatizados de respaldo.

---

## 🛠️ Estructura Tecnológica Actual

| Capa | Tecnología / Herramienta |
| :--- | :--- |
| **Framework Frontend** | Angular 17 (Standalone Components) |
| **Backend / Proxy** | Node.js + Express |
| **Estilos** | CSS puro con Variables de Diseño (*Design Tokens*) |
| **Base de Datos / Sesiones**| Persistencia en `stores-db.json` (Local DB) |
| **Servicio de Correos** | Nodemailer (Soporte SMTP y Fallback a Archivos locales) |
| **Pasarela de Pagos** | Mercado Pago SDK (Backend v2.0.15 + Frontend JS v2) |
| **Notificaciones y Alerts** | SweetAlert2 |
| **Despliegue / Contenedores**| Docker (Multi-stage) + Nginx |

---

## 🚀 Próximos Pasos Sugeridos
1. **Configuración de Variables de Entorno SMTP:** Inyectar las credenciales reales (`SMTP_USER`, `SMTP_PASS`, etc.) en el archivo `.env` de producción para habilitar la entrega de correos de contraseña en tiempo real.
2. **Pruebas de Webhook en Producción:** Configurar túneles seguros para exponer `/webhook` localmente y comprobar respuestas reales de Mercado Pago en tiempo de ejecución.
3. **Proceso de Homologación:** Enviar el formulario oficial utilizando los IDs de transacciones de prueba generados al simular compras en el componente de Precios.
