export const SwaggerExamples = {
  // Message Examples
  sendMessageWhatsApp: {
    summary: 'Send WhatsApp Message',
    value: {
      to: '1234567890',
      message: 'Hola desde WhatsApp API!',
      platform: 'whatsapp',
      type: 'text',
    },
  },
  sendMessageSlack: {
    summary: 'Send Slack Message',
    value: {
      to: '#general',
      message: 'Hola desde Slack API!',
      platform: 'slack',
      type: 'text',
    },
  },
  sendImageMessage: {
    summary: 'Send Image Message',
    value: {
      to: '1234567890',
      message: 'Mira esta imagen!',
      platform: 'whatsapp',
      type: 'image',
      mediaUrl: 'https://example.com/image.jpg',
      caption: 'Imagen desde la API',
    },
  },
  sendDocumentMessage: {
    summary: 'Send Document Message',
    value: {
      to: '#general',
      message: 'Aquí tienes el documento',
      platform: 'slack',
      type: 'document',
      mediaUrl: 'https://example.com/document.pdf',
      filename: 'documento.pdf',
      caption: 'Documento importante',
    },
  },

  // Auth Examples
  loginRequest: {
    summary: 'User Login',
    value: {
      username: 'admin',
      password: 'admin123',
    },
  },
  loginResponse: {
    summary: 'Login Success',
    value: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      token_type: 'Bearer',
      expires_in: 3600,
    },
  },

  // API Key Examples
  createApiKey: {
    summary: 'Create API Key',
    value: {
      name: 'Webhook Integration',
      permissions: ['webhook', 'read'],
    },
  },

  // Response Examples
  successResponse: {
    summary: 'Success Response',
    value: {
      success: true,
      message: 'Operation completed successfully',
      timestamp: '2023-12-01T10:30:00.000Z',
    },
  },
  errorResponse: {
    summary: 'Error Response',
    value: {
      success: false,
      error: 'Something went wrong',
      message: 'An error occurred',
      timestamp: '2023-12-01T10:30:00.000Z',
    },
  },
  validationError: {
    summary: 'Validation Error',
    value: {
      success: false,
      error: 'Validation failed',
      message: 'Invalid request data',
      details: ['Phone number must contain only digits'],
      timestamp: '2023-12-01T10:30:00.000Z',
    },
  },

  // Health Check Examples
  healthCheckHealthy: {
    summary: 'Healthy System',
    value: {
      status: 'healthy',
      uptime: 3600,
      timestamp: '2023-12-01T10:30:00.000Z',
      services: {
        whatsapp: true,
        slack: true,
      },
    },
  },
  healthCheckUnhealthy: {
    summary: 'Unhealthy System',
    value: {
      status: 'unhealthy',
      uptime: 3600,
      timestamp: '2023-12-01T10:30:00.000Z',
      services: {
        whatsapp: false,
        slack: true,
      },
    },
  },

  // Platform Status Examples
  whatsappStatus: {
    summary: 'WhatsApp Status',
    value: {
      platform: 'whatsapp',
      isConnected: true,
      lastSeen: '2023-12-01T10:30:00.000Z',
      phoneNumber: '+1234567890',
    },
  },
  slackStatus: {
    summary: 'Slack Status',
    value: {
      platform: 'slack',
      isConnected: true,
      lastSeen: '2023-12-01T10:30:00.000Z',
      workspaceName: 'My Workspace',
    },
  },
};
