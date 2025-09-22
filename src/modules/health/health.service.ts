import { Injectable, Logger } from '@nestjs/common';
import { MessagingFactoryService } from '../../common/services/messaging-factory.service';
import { HealthCheckDto } from '../../common/dto/health.dto';
import { Platform } from '../../common/dto/message.dto';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private messagingFactory: MessagingFactoryService) {}

  async getHealthCheck(): Promise<HealthCheckDto> {
    try {
      const servicesStatus = await this.messagingFactory.getAllServicesStatus();

      // Check if all services are healthy
      const allServicesHealthy = Array.from(servicesStatus.values()).every(
        (status) => status.isConnected,
      );

      const healthCheck: HealthCheckDto = {
        status: allServicesHealthy ? 'healthy' : 'unhealthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        services: {
          whatsapp: servicesStatus.get(Platform.WHATSAPP)?.isConnected || false,
          slack: servicesStatus.get(Platform.SLACK)?.isConnected || false,
        },
      };

      return healthCheck;
    } catch (error) {
      this.logger.error('Health check failed:', error);

      return {
        status: 'unhealthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        services: {
          whatsapp: false,
          slack: false,
        },
      };
    }
  }
}
