import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Messaging Platform API')
  .setDescription(`
    ## 🚀 Messaging Platform API
    
    Una plataforma profesional de mensajería que soporta múltiples canales de comunicación.
    
    ### 📱 Plataformas Soportadas
    - **WhatsApp**: Envío de mensajes, imágenes, documentos y más
    - **Slack**: Integración completa con workspaces de Slack
    
    ### 🔐 Autenticación
    - **API Keys**: Para webhooks y integraciones
    - **JWT Tokens**: Para usuarios y administración
    
    ### 📚 Características
    - ✅ Envío de mensajes de texto
    - ✅ Envío de imágenes con caption
    - ✅ Envío de documentos y archivos
    - ✅ Validación robusta de datos
    - ✅ Rate limiting y seguridad
    - ✅ Logging completo
    - ✅ Health checks
    
    ### 🚀 Uso Rápido
    
    \`\`\`bash
    # 1. Obtener API Key (después de autenticarse)
    curl -X POST http://localhost:3000/api/v1/auth/login \\
      -H "Content-Type: application/json" \\
      -d '{"username": "admin", "password": "admin123"}'
    
    # 2. Enviar mensaje a WhatsApp
    curl -X POST http://localhost:3000/api/v1/messages/send \\
      -H "Authorization: Bearer webhook-default-key-12345" \\
      -H "Content-Type: application/json" \\
      -d '{
        "to": "1234567890",
        "message": "Hola desde la API!",
        "platform": "whatsapp"
      }'
    
    # 3. Enviar mensaje a Slack
    curl -X POST http://localhost:3000/api/v1/messages/send \\
      -H "Authorization: Bearer webhook-default-key-12345" \\
      -H "Content-Type: application/json" \\
      -d '{
        "to": "#general",
        "message": "Hola desde la API!",
        "platform": "slack"
      }'
    \`\`\`
  `)
  .setVersion('1.0.0')
  .setContact('Luis Martinez', 'https://github.com/luismartinez', 'luis@example.com')
  .setLicense('MIT', 'https://opensource.org/licenses/MIT')
  .addServer('http://localhost:3000', 'Development server')
  .addServer('https://api.messaging-platform.com', 'Production server')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth',
  )
  .addApiKey(
    {
      type: 'apiKey',
      name: 'X-API-Key',
      in: 'header',
      description: 'Enter API key',
    },
    'api-key',
  )
  .addApiKey(
    {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Enter API key with Bearer prefix (e.g., Bearer your-api-key)',
    },
    'api-key-bearer',
  )
  .addTag('auth', '🔐 Authentication & Authorization')
  .addTag('messages', '📱 Message Sending')
  .addTag('platforms', '🔧 Platform Management')
  .addTag('health', '💚 Health & Monitoring')
  .build();

export const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showRequestHeaders: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
    requestSnippetsEnabled: true,
    syntaxHighlight: {
      activate: true,
      theme: 'agate',
    },
    defaultModelsExpandDepth: 2,
    defaultModelExpandDepth: 2,
  },
  customSiteTitle: 'Messaging Platform API Documentation',
  customfavIcon: 'https://nestjs.com/img/logo-small.svg',
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #3b82f6; }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; border-radius: 8px; }
  `,
};
