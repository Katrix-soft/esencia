#!/bin/bash
# reorganize.sh — Script para reorganizar el proyecto Esencia
# Ejecutar desde la raíz del proyecto DESPUÉS de detener todos los servidores
# Uso: bash reorganize.sh

set -e

echo "🔄 Reorganizando proyecto Esencia..."
echo ""
echo "⚠️  Asegurate de haber detenido el servidor Node.js y Angular antes de continuar."
echo "    (Ctrl+C en las terminales que corren node server.js y npm start)"
echo ""
read -p "¿Continuar? [y/N]: " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Operación cancelada."
  exit 0
fi

# 1. Mover archivos backend
echo ""
echo "📁 Moviendo archivos del backend a backend/..."
git mv api.js server.js swagger-spec.js backend/
git mv db lib middleware routes schemas tests backend/

# Mover emails si existe
if [ -d "emails" ]; then
  git mv emails backend/
fi

# Mover stores-db.json si aún existe
if [ -f "stores-db.json" ]; then
  git mv stores-db.json backend/
fi

echo "✅ Archivos movidos."

# 2. Actualizar server.js: dist path ahora es ../dist
echo ""
echo "🔧 Actualizando path del frontend en backend/server.js..."
sed -i "s|path.join(__dirname, 'dist/esencia-app/browser')|path.join(__dirname, '../dist/esencia-app/browser')|g" backend/server.js
echo "✅ server.js actualizado."

# 3. Actualizar .gitignore si es necesario
echo ""
echo "🔧 Actualizando .gitignore..."
if ! grep -q "backend/node_modules" .gitignore 2>/dev/null; then
  echo "backend/node_modules/" >> .gitignore
fi
echo "✅ .gitignore actualizado."

echo ""
echo "🎉 Reorganización completa."
echo ""
echo "📋 Próximos pasos:"
echo "   1. npm install              (instalar deps de Angular en la raíz)"
echo "   2. cd backend && npm install (instalar deps de Node.js en backend/)"
echo "   3. cd .. && node backend/server.js"
echo "   4. git add -A && git commit -m 'refactor: separate backend into backend/ directory'"
