# 📚 Documentación Swagger

## 🚀 Acceso a la Documentación

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

**URL:** `http://localhost:3000/api/docs`

## 🔧 Características de la Documentación

### ✨ Interfaz Mejorada
- **Diseño personalizado** con colores y estilos profesionales
- **Navegación intuitiva** con tags organizados
- **Búsqueda integrada** para encontrar endpoints rápidamente
- **Sintaxis highlighting** para mejor legibilidad del código

### 🔐 Autenticación Múltiple
La documentación soporta dos tipos de autenticación:

#### 1. **JWT Bearer Token** (Para usuarios)
```bash
# Obtener token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Usar token en Swagger
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 2. **API Key** (Para webhooks)
```bash
# Usar API Key en Swagger
X-API-Key: webhook-default-key-12345

# O con Bearer
Authorization: Bearer webhook-default-key-12345
```

## 📱 Endpoints Documentados

### 🔐 Autenticación (`/auth`)
- `POST /auth/login` - Iniciar sesión y obtener JWT
- `GET /auth/profile` - Obtener perfil del usuario
- `GET /auth/api-keys` - Listar API keys
- `POST /auth/api-keys` - Crear nueva API key
- `DELETE /auth/api-keys/:key` - Revocar API key

### 📱 Mensajes (`/messages`)
- `POST /messages/send` - Enviar mensaje (WhatsApp/Slack)
- `GET /messages/status` - Estado de todas las plataformas
- `GET /messages/status/:platform` - Estado de plataforma específica
- `GET /messages/platforms` - Plataformas disponibles
- `POST /messages/initialize` - Inicializar todas las plataformas

### 💚 Health Check (`/health`)
- `GET /health` - Verificar estado del sistema

## 🧪 Probar la API

### 1. **Configurar Autenticación**
1. Ve a la sección "Authentication" en Swagger
2. Selecciona el tipo de autenticación (JWT o API Key)
3. Ingresa tu token o API key
4. Haz clic en "Authorize"

### 2. **Enviar un Mensaje**
1. Ve a `POST /messages/send`
2. Haz clic en "Try it out"
3. Completa el JSON con tus datos:

```json
{
  "to": "1234567890",
  "message": "Hola desde Swagger!",
  "platform": "whatsapp",
  "type": "text"
}
```

4. Haz clic en "Execute"

### 3. **Ver Respuestas**
- **200**: Operación exitosa
- **400**: Error de validación
- **401**: Error de autenticación
- **500**: Error del servidor

## 📋 Ejemplos de Uso

### WhatsApp
```json
{
  "to": "1234567890",
  "message": "Hola desde WhatsApp!",
  "platform": "whatsapp",
  "type": "text"
}
```

### Slack
```json
{
  "to": "#general",
  "message": "Hola desde Slack!",
  "platform": "slack",
  "type": "text"
}
```

### Imagen con Caption
```json
{
  "to": "1234567890",
  "message": "Mira esta imagen!",
  "platform": "whatsapp",
  "type": "image",
  "mediaUrl": "https://example.com/image.jpg",
  "caption": "Imagen desde la API"
}
```

### Documento
```json
{
  "to": "#general",
  "message": "Aquí tienes el documento",
  "platform": "slack",
  "type": "document",
  "mediaUrl": "https://example.com/document.pdf",
  "filename": "documento.pdf",
  "caption": "Documento importante"
}
```

## 🔍 Características Avanzadas

### 📊 Monitoreo
- **Request Duration**: Tiempo de respuesta de cada endpoint
- **Status Codes**: Códigos de estado detallados
- **Error Messages**: Mensajes de error descriptivos

### 🎨 Personalización
- **Tema personalizado** con colores de la marca
- **Logo personalizado** en la interfaz
- **CSS customizado** para mejor experiencia

### 📱 Responsive
- **Diseño adaptativo** para móviles y tablets
- **Navegación táctil** optimizada
- **Menús colapsables** para mejor organización

## 🚀 Desarrollo

### Agregar Nuevos Endpoints
1. Crea el controlador con decoradores de Swagger
2. Documenta los DTOs con `@ApiProperty`
3. Agrega ejemplos con `@ApiResponse`
4. La documentación se actualiza automáticamente

### Personalizar Documentación
Edita `src/config/swagger.config.ts` para:
- Cambiar el título y descripción
- Agregar nuevos tags
- Modificar la autenticación
- Personalizar la interfaz

## 📚 Recursos Adicionales

- [Documentación oficial de Swagger](https://swagger.io/docs/)
- [NestJS Swagger Module](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI Specification](https://swagger.io/specification/)

## 🆘 Solución de Problemas

### Error 401 (Unauthorized)
- Verifica que el token/API key sea válido
- Asegúrate de que el formato sea correcto
- Revisa que el endpoint requiera autenticación

### Error 400 (Bad Request)
- Verifica el formato del JSON
- Revisa los campos requeridos
- Consulta la validación en los DTOs

### Error 500 (Internal Server Error)
- Revisa los logs del servidor
- Verifica la configuración de las plataformas
- Asegúrate de que los servicios estén inicializados
