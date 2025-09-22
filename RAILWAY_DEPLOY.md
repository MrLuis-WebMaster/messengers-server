# 🚀 Despliegue en Railway

## Pasos Rápidos

### 1. Subir a GitHub
```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### 2. Conectar con Railway
1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con GitHub
3. Crea **"New Project"**
4. Selecciona **"Deploy from GitHub repo"**
5. Elige tu repositorio `whatsapp-messenger`

### 3. Configurar Variables de Entorno
En Railway dashboard → **Variables** → Copia desde `railway.env.example`:

#### **Obligatorias:**
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=tu-jwt-secret-super-seguro
AUTH_USERNAME=admin
AUTH_PASSWORD=tu-password-seguro
DEFAULT_API_KEY=tu-api-key-webhook
WEBHOOK_SECRET=tu-webhook-secret
LISTMONK_WEBHOOK_SECRET=tu-listmonk-secret
```

#### **Opcionales:**
```env
LOG_LEVEL=info
THROTTLE_TTL=60000
THROTTLE_LIMIT=10
SLACK_BOT_TOKEN=xoxb-tu-slack-token
SLACK_SIGNING_SECRET=tu-slack-secret
LISTMONK_DEFAULT_PHONE_FIELD=phone
LISTMONK_DEFAULT_CHANNEL=#general
```

### 4. ¡Listo!
Railway detectará automáticamente que es una app Node.js y la desplegará.

## 🔗 URLs Importantes

- **API**: `https://tu-app.railway.app/api/v1`
- **Documentación**: `https://tu-app.railway.app/api/docs`
- **Health Check**: `https://tu-app.railway.app/api/v1/health`

## 🧪 Probar

```bash
# Health check
curl https://tu-app.railway.app/api/v1/health

# Enviar mensaje Slack
curl -X POST https://tu-app.railway.app/api/v1/messages/send \
  -H "X-API-Key: tu-api-key" \
  -H "Content-Type: application/json" \
  -d '{"to": "#general", "message": "Hello!", "platform": "slack", "type": "text"}'
```

## ⚠️ Notas Importantes

- **WhatsApp**: Deshabilitado en Railway (limitaciones de Puppeteer)
- **Slack**: ✅ Funciona perfectamente
- **Listmonk**: ✅ Funciona perfectamente

## 🔄 Actualizaciones

Para actualizar:
```bash
git add .
git commit -m "Update"
git push origin main
```

Railway desplegará automáticamente.
