const fs = require('fs');
const path = require('path');

const envContent = `# ===========================================
# MESSAGING PLATFORM API - CONFIGURACIÓN
# ===========================================

# Server Configuration
PORT=3000
NODE_ENV=development

# ===========================================
# JWT CONFIGURATION
# ===========================================
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h

# ===========================================
# AUTHENTICATION
# ===========================================
AUTH_USERNAME=admin
AUTH_PASSWORD=admin123

# ===========================================
# API KEYS & WEBHOOKS
# ===========================================
DEFAULT_API_KEY=webhook-default-key-12345
WEBHOOK_SECRET=your-webhook-secret-change-this

# ===========================================
# CORS CONFIGURATION
# ===========================================
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:8080

# ===========================================
# LOGGING
# ===========================================
LOG_LEVEL=info

# ===========================================
# RATE LIMITING
# ===========================================
THROTTLE_TTL=60000
THROTTLE_LIMIT=10

# ===========================================
# WHATSAPP CONFIGURATION
# ===========================================
WHATSAPP_SESSION_NAME=whatsapp-session

# ===========================================
# SLACK CONFIGURATION
# ===========================================
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token-here
SLACK_SIGNING_SECRET=your-slack-signing-secret-here

# ===========================================
# LISTMONK INTEGRATION
# ===========================================
LISTMONK_WEBHOOK_SECRET=your-listmonk-webhook-secret
LISTMONK_DEFAULT_PHONE_FIELD=phone
LISTMONK_DEFAULT_CHANNEL=#general

# ===========================================
# PRODUCTION OVERRIDES (uncomment for production)
# ===========================================
# NODE_ENV=production
# LOG_LEVEL=warn
# THROTTLE_LIMIT=100
# JWT_EXPIRES_IN=24h`;

const envPath = path.join(__dirname, '..', '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env creado exitosamente!');
  console.log('📝 Ubicación:', envPath);
  console.log('');
  console.log('🔧 Próximos pasos:');
  console.log('1. Edita el archivo .env con tus valores reales');
  console.log('2. Cambia JWT_SECRET por una clave segura');
  console.log('3. Configura SLACK_BOT_TOKEN si usas Slack');
  console.log('4. Ajusta otros valores según necesites');
} catch (error) {
  console.error('❌ Error creando .env:', error.message);
  console.log('');
  console.log('📋 Crea manualmente el archivo .env con este contenido:');
  console.log('');
  console.log(envContent);
}
