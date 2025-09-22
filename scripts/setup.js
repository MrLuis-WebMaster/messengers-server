const fs = require('fs');
const path = require('path');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from env.example');
  } else {
    // Create basic .env file
    const envContent = `# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=1h

# Authentication
AUTH_USERNAME=admin
AUTH_PASSWORD=admin123

# API Keys
DEFAULT_API_KEY=webhook-default-key-12345
WEBHOOK_SECRET=your-webhook-secret-here

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Logging
LOG_LEVEL=info

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=10

# WhatsApp Configuration
WHATSAPP_SESSION_NAME=whatsapp-session

# Slack Configuration
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_SIGNING_SECRET=your-slack-signing-secret
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file with default values');
  }
} else {
  console.log('✅ .env file already exists');
}

// Create logs directory
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('✅ Created logs directory');
}

// Create .env file
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
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with default configuration');
} else {
  console.log('✅ .env file already exists');
}

console.log('🚀 Setup completed! You can now run: npm run start:dev');
console.log('');
console.log('🔧 Important: Edit .env file with your actual values before starting!');
