import { ConfigService } from '@nestjs/config';

export const isRailwayEnvironment = (): boolean => {
  return process.env.NODE_ENV === 'production' && 
         (process.env.RAILWAY_ENVIRONMENT === 'true' || 
          process.env.RAILWAY_PROJECT_ID !== undefined);
};

export const getRailwayConfig = (configService: ConfigService) => ({
  // Disable WhatsApp in Railway due to Puppeteer limitations
  whatsappEnabled: !isRailwayEnvironment(),
  
  // Use external services for WhatsApp in Railway
  whatsappExternalService: isRailwayEnvironment() ? {
    enabled: true,
    // You can configure external WhatsApp service here
    // For example: Baileys API, Twilio, etc.
    apiUrl: process.env.WHATSAPP_EXTERNAL_API_URL,
    apiKey: process.env.WHATSAPP_EXTERNAL_API_KEY,
  } : null,
  
  // Railway-specific configurations
  railway: {
    environment: process.env.RAILWAY_ENVIRONMENT,
    projectId: process.env.RAILWAY_PROJECT_ID,
    serviceId: process.env.RAILWAY_SERVICE_ID,
  },
});
