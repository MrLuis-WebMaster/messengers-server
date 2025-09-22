# Messaging Platform API

Una plataforma profesional de mensajería construida con NestJS que soporta WhatsApp, Slack y más plataformas. Diseñada para webhooks y autenticación robusta.

## 🚀 Características

- **Multi-plataforma**: WhatsApp, Slack (extensible a más)
- **Autenticación Híbrida**: API Keys para webhooks + JWT para usuarios
- **Seguridad Robusta**: HMAC signatures, rate limiting, validación
- **Arquitectura Escalable**: Módulos independientes y reutilizables
- **Documentación Automática**: Swagger/OpenAPI integrado
- **TypeScript**: Código tipado y mantenible
- **Logging Avanzado**: Winston con diferentes niveles

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- WhatsApp móvil (para escanear QR)

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd messaging-platform
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   
   Editar `.env` con tus configuraciones.

4. **Ejecutar el servidor**
   ```bash
   # Desarrollo
   npm run start:dev
   
   # Producción
   npm run build
   npm run start:prod
   ```

## 🔐 Sistema de Autenticación

### Para Webhooks (API Keys)

```bash
# Enviar mensaje con API Key
curl -X POST http://localhost:3000/api/v1/messages/send \
  -H "Authorization: Bearer webhook-default-key-12345" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "1234567890",
    "message": "Hola desde webhook!",
    "platform": "whatsapp"
  }'
```

### Para Usuarios (JWT)

```bash
# 1. Autenticarse
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# 2. Usar el token JWT
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer <tu-jwt-token>"
```

## 📱 Uso de la API

### Enviar Mensajes

#### WhatsApp
```bash
curl -X POST http://localhost:3000/api/v1/messages/send \
  -H "Authorization: Bearer webhook-default-key-12345" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "1234567890",
    "message": "Hola desde WhatsApp!",
    "platform": "whatsapp",
    "type": "text"
  }'
```

#### Slack
```bash
curl -X POST http://localhost:3000/api/v1/messages/send \
  -H "Authorization: Bearer webhook-default-key-12345" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "general",
    "message": "Hola desde Slack!",
    "platform": "slack",
    "type": "text"
  }'
```

### Con Media
```bash
curl -X POST http://localhost:3000/api/v1/messages/send \
  -H "Authorization: Bearer webhook-default-key-12345" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "1234567890",
    "message": "Mira esta imagen!",
    "platform": "whatsapp",
    "type": "image",
    "mediaUrl": "https://example.com/image.jpg",
    "caption": "Imagen desde la API"
  }'
```

## 🔧 Endpoints Principales

### Autenticación
- `POST /api/v1/auth/login` - Login de usuario
- `GET /api/v1/auth/profile` - Perfil del usuario
- `GET /api/v1/auth/api-keys` - Listar API keys
- `POST /api/v1/auth/api-keys` - Crear API key
- `DELETE /api/v1/auth/api-keys/:key` - Revocar API key

### Mensajes
- `POST /api/v1/messages/send` - Enviar mensaje
- `GET /api/v1/messages/status` - Estado de las plataformas

### Sistema
- `GET /api/v1/health` - Health check
- `GET /api/docs` - Documentación Swagger

## 🏗️ Arquitectura

```
src/
├── modules/
│   ├── auth/                 # Autenticación (JWT + API Keys)
│   ├── messages/             # Envío de mensajes
│   ├── whatsapp/             # Servicio WhatsApp
│   ├── slack/                # Servicio Slack
│   └── health/               # Health checks
├── common/
│   ├── dto/                  # Data Transfer Objects
│   ├── guards/               # Guards de autenticación
│   └── decorators/           # Decoradores personalizados
├── config/                   # Configuraciones
└── main.ts                   # Punto de entrada
```

## 🔒 Seguridad

### API Keys para Webhooks
- **Identificación**: Cada webhook tiene una API key única
- **Rate Limiting**: Límite por API key y por IP
- **HMAC Signatures**: Verificación de integridad (opcional)
- **Permisos**: Control granular de permisos por API key

### JWT para Usuarios
- **Tokens seguros**: JWT con expiración configurable
- **Roles y Permisos**: Sistema de roles extensible
- **Refresh Tokens**: Renovación automática (futuro)

## 📊 Monitoreo

### Health Check
```bash
curl http://localhost:3000/api/v1/health
```

### Logs
Los logs se guardan en `logs/`:
- `error.log`: Solo errores
- `combined.log`: Todos los logs

## 🚀 Despliegue

### Variables de Entorno de Producción
```env
NODE_ENV=production
JWT_SECRET=your-super-secret-key
WEBHOOK_SECRET=your-webhook-secret
THROTTLE_LIMIT=100
LOG_LEVEL=warn
```

### Sin Docker
```bash
npm run build
npm run start:prod
```

## 🔄 Escalabilidad

### Agregar Nueva Plataforma
1. Crear módulo: `src/modules/telegram/`
2. Implementar servicio de mensajería
3. Registrar en el módulo de mensajes
4. Actualizar DTOs y documentación

### Agregar Nuevos Permisos
1. Actualizar `AuthService`
2. Crear guards específicos
3. Aplicar en controladores

## 📚 Documentación

- **Swagger UI**: http://localhost:3000/api/docs
- **API Reference**: Documentación automática
- **Ejemplos**: Incluidos en Swagger

## ⚠️ Notas Importantes

- **WhatsApp ToS**: Cumplir con términos de servicio
- **Rate Limits**: Respetar límites de cada plataforma
- **API Keys**: Mantener seguras y rotar regularmente
- **Logs**: Monitorear para detectar abuso

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.