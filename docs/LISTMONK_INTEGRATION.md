# 📧 Integración con Listmonk

Esta guía te ayudará a configurar Listmonk para que envíe mensajes a través de tu API de mensajería.

## 🔧 Configuración en Listmonk

### 1. **Configuración Básica del Mensajero**

En la interfaz de Listmonk, configura los siguientes valores:

| Campo | Valor | Descripción |
|-------|-------|-------------|
| **Habilitar** | ✅ Activado | Activar el mensajero |
| **Nombre** | `whatsapp-messenger` | Identificador único del mensajero |
| **URL** | `http://localhost:3000/api/v1/messages/listmonk` | Endpoint específico para Listmonk |

### 2. **Autenticación**

| Campo | Valor | Descripción |
|-------|-------|-------------|
| **Nombre de usuario** | `admin` | Usuario configurado en tu API |
| **Contraseña** | `admin123` | Contraseña configurada en tu API |

### 3. **Configuración Avanzada**

| Campo | Valor Recomendado | Descripción |
|-------|------------------|-------------|
| **Conexiones máximas** | `25` | Número máximo de conexiones simultáneas |
| **Reintentos** | `3` | Número de reintentos en caso de fallo |
| **Tiempo máximo por inactividad** | `30s` | Tiempo de espera antes de cerrar conexiones |

## 📋 Formato de Datos

Tu API espera recibir los datos de Listmonk en el siguiente formato:

```json
{
  "id": "msg_123456",
  "campaign_id": "camp_789",
  "email": "user@example.com",
  "name": "John Doe",
  "subject": "Welcome to our newsletter!",
  "body": "<p>Welcome to our newsletter!</p>",
  "text": "Welcome to our newsletter!",
  "phone": "1234567890",
  "channel": "#general",
  "type": "whatsapp",
  "meta": {
    "list_id": "list_123",
    "template_id": "tpl_456"
  }
}
```

## 🚀 Configuración por Plataforma

### **Para WhatsApp:**
- **type**: `"whatsapp"`
- **phone**: Número de teléfono del destinatario
- **to**: Se usará el campo `phone` o `email` como fallback

### **Para Slack:**
- **type**: `"slack"`
- **channel**: Canal de Slack (ej: `#general`)
- **to**: Se usará el campo `channel` o `#general` como fallback

## 📱 Ejemplo de Mensaje Enviado

Cuando Listmonk envíe un mensaje, tu API lo formateará así:

```
📧 *Welcome to our newsletter!*

Welcome to our newsletter!

---
*Enviado via WhatsApp desde Listmonk*
*ID: msg_123456 | Campaña: camp_789*
```

## 🔍 Testing de la Integración

### 1. **Probar el Endpoint Directamente**

```bash
curl -X POST http://localhost:3000/api/v1/messages/listmonk \
  -H "Authorization: Bearer webhook-default-key-12345" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_123",
    "campaign_id": "test_camp",
    "email": "test@example.com",
    "name": "Test User",
    "subject": "Test Message",
    "body": "<p>This is a test</p>",
    "text": "This is a test",
    "phone": "1234567890",
    "type": "whatsapp"
  }'
```

### 2. **Verificar Logs**

Revisa los logs de tu API para confirmar que los mensajes se están procesando:

```bash
# Ver logs en tiempo real
tail -f logs/combined.log
```

### 3. **Probar desde Listmonk**

1. Crea una campaña de prueba en Listmonk
2. Configura el mensajero con los valores de arriba
3. Envía un mensaje de prueba
4. Verifica que llegue a WhatsApp/Slack

## ⚙️ Configuración Avanzada

### **Variables de Entorno Adicionales**

Puedes agregar estas variables a tu `.env`:

```env
# Listmonk Configuration
LISTMONK_WEBHOOK_SECRET=your-webhook-secret
LISTMONK_DEFAULT_PHONE_FIELD=phone
LISTMONK_DEFAULT_CHANNEL=#general
```

### **Personalizar Formato de Mensaje**

Puedes modificar el método `formatListmonkMessage` en `messages.service.ts` para personalizar cómo se formatean los mensajes:

```typescript
private formatListmonkMessage(data: ListmonkMessageDto): string {
  // Tu formato personalizado aquí
  return `Mensaje personalizado: ${data.subject}`;
}
```

## 🚨 Solución de Problemas

### **Error 401 (Unauthorized)**
- Verifica que la API key sea correcta
- Asegúrate de que el endpoint `/listmonk` esté configurado

### **Error 400 (Bad Request)**
- Verifica que Listmonk esté enviando todos los campos requeridos
- Revisa el formato del JSON

### **Error 500 (Internal Server Error)**
- Verifica que los servicios de WhatsApp/Slack estén inicializados
- Revisa los logs para más detalles

### **Mensajes no llegan**
- Verifica que WhatsApp esté conectado (escanea el QR)
- Verifica que Slack tenga el token correcto
- Revisa que los números de teléfono/canales sean válidos

## 📊 Monitoreo

### **Health Check**
```bash
curl http://localhost:3000/api/v1/health
```

### **Estado de Plataformas**
```bash
curl -H "Authorization: Bearer your-jwt-token" \
  http://localhost:3000/api/v1/messages/status
```

## 🔄 Actualizaciones

Para actualizar la configuración:

1. Modifica los valores en Listmonk
2. Reinicia tu API si es necesario
3. Prueba con un mensaje de prueba
4. Verifica los logs

## 📚 Recursos Adicionales

- [Documentación de Listmonk](https://listmonk.app/docs/)
- [API de Listmonk](https://listmonk.app/docs/api/)
- [Configuración de Mensajeros](https://listmonk.app/docs/configuration/#messengers)
