# Esencia — Angular App

SaaS landing page para perfumerías inteligentes, migrada a **Angular 17** (standalone components).

## Requisitos

- Node.js ≥ 18
- npm ≥ 9

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm start
# Abre http://localhost:4200
```

## Build producción

```bash
npm run build
```

## Estructura del proyecto

```
src/
├── index.html                  # HTML shell
├── main.ts                     # Bootstrap
├── styles.css                  # Tokens de diseño globales + animaciones
└── app/
    ├── app.component.ts        # Root component
    ├── services/
    │   └── scroll-reveal.service.ts
    └── components/
        ├── shader-canvas/      # Fondo WebGL (simplex noise)
        ├── navbar/             # Barra de navegación sticky
        ├── hero/               # Sección hero con imagen flotante
        ├── bento/              # Grid de módulos (bento)
        ├── pricing/            # Tarjetas de precios
        └── footer/             # Pie de página
```

## Tecnologías

| Capa | Tecnología |
|---|---|
| Framework | Angular 17 (standalone) |
| Estilos | CSS puro con custom properties (design tokens) |
| Animaciones | CSS keyframes + IntersectionObserver |
| Fondo | WebGL (GLSL simplex noise shader) |
| Tipografía | Google Fonts: Literata + Nunito Sans |
| Iconos | Material Symbols Outlined |
## Mercado Pago MCP Server

**Mercado Pago MCP Server** implementa el estándar abierto [Model Context Protocol (MCP)](https://modelcontextprotocol.io) para facilitar el acceso a las APIs y herramientas de Mercado Pago a agentes de IA o LLMs en entornos de desarrollo compatibles.

Este servidor actúa como intermediario, traduciendo los recursos del ecosistema de Mercado Pago en _tools_ ejecutables que las aplicaciones de inteligencia artificial pueden invocar para realizar acciones, extendiendo las capacidades tradicionales de las APIs de Mercado Pago a flujos automatizados o asistidos por IA.

### Qué puedes hacer con el MCP Server

El MCP Server ofrece _tools_ que cubren el ciclo completo de integración, desde el onboarding hasta la validación en producción:

- Busca documentación oficial de Mercado Pago sin salir de tu entorno de desarrollo.
- Gestiona tus aplicaciones: crea nuevas aplicaciones, obtén credenciales y consulta la información vinculada a tu cuenta. **Disponible únicamente vía OAuth.**
- Configura y monitorea notificaciones Webhooks.
- Crea usuarios de prueba y administra sus fondos para validar flujos de pago.
- Mejora la calidad de tu integración antes de salir a producción y realiza la medición oficial de Mercado Pago.

Para información específica sobre cada _tool_ y sus parámetros, consulta [Tools disponibles](https://www.mercadopago.com.ar/developers/es/docs/mcp-server/tools).

### Requisitos previos

Antes de empezar a utilizar el servidor, confirma que tienes todo el entorno listo:

| Requisito | Descripción |
|---|---|
| **Cliente** | La conexión a Mercado Pago MCP Server es remota, por lo que necesitas elegir un cliente desde donde interactuar con el asistente. La solución está disponible para los principales agentes de IA: Cursor (versión 1 o superior), VS Code, Windsurf, Cline, Claude Desktop o Code y ChatGPT. En todos los casos, asegúrate de tener la última versión disponible. |

### Configuración en Clientes MCP

Para integrar el servidor en tu IDE o cliente MCP (como Cursor o Claude Desktop), añade la siguiente configuración:

```json
{
  "mcpServers": {
    "mercadopago-mcp-server": {
      "url": "https://mcp.mercadopago.com/mcp"
    }
  }
}
```
