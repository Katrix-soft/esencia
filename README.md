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
# esencia
