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

## 🚀 Próximos Pasos Sugeridos
1. **Pruebas de Webhook en Producción:** Configurar túneles seguros (e.g., ngrok o Cloudflare Tunnels) para exponer `/webhook` localmente y comprobar respuestas reales de Mercado Pago en tiempo de ejecución.
2. **Proceso de Homologación:** Enviar el formulario oficial utilizando los IDs de transacciones de prueba generados al simular compras en el componente de Precios.
