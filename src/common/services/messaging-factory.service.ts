import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Platform } from '../dto/message.dto';
import { MessagingService } from '../interfaces/messaging.interface';
import { WhatsappService } from '../../modules/whatsapp/whatsapp.service';
import { SlackService } from '../../modules/slack/slack.service';

@Injectable()
export class MessagingFactoryService {
  private readonly logger = new Logger(MessagingFactoryService.name);
  private services: Map<Platform, MessagingService> = new Map();

  constructor(
    private configService: ConfigService,
    private whatsappService: WhatsappService,
    private slackService: SlackService,
  ) {
    this.initializeServices();
  }

  private initializeServices(): void {
    // Register WhatsApp service
    this.services.set(Platform.WHATSAPP, this.whatsappService);

    // Register Slack service
    this.services.set(Platform.SLACK, this.slackService);

    this.logger.log('Messaging services registered');
  }

  /**
   * Get messaging service for a specific platform
   */
  getService(platform: Platform): MessagingService {
    const service = this.services.get(platform);

    if (!service) {
      throw new Error(`Messaging service for platform ${platform} not found`);
    }

    return service;
  }

  /**
   * Get all available platforms
   */
  getAvailablePlatforms(): Platform[] {
    return Array.from(this.services.keys());
  }

  /**
   * Get all services
   */
  getAllServices(): MessagingService[] {
    return Array.from(this.services.values());
  }

  /**
   * Initialize all services
   */
  async initializeAllServices(): Promise<void> {
    const initPromises = this.getAllServices().map(async (service) => {
      try {
        await service.initialize();
        this.logger.log(`${service.platform} service initialized successfully`);
      } catch (error) {
        this.logger.error(
          `Failed to initialize ${service.platform} service:`,
          error,
        );
        throw error;
      }
    });

    await Promise.all(initPromises);
  }

  /**
   * Get status of all services
   */
  async getAllServicesStatus(): Promise<Map<Platform, any>> {
    const statusMap = new Map();

    for (const [platform, service] of this.services) {
      try {
        const status = await service.getStatus();
        statusMap.set(platform, status);
      } catch (error) {
        this.logger.error(`Failed to get status for ${platform}:`, error);
        statusMap.set(platform, {
          platform,
          isConnected: false,
          error: error.message,
        });
      }
    }

    return statusMap;
  }

  /**
   * Destroy all services
   */
  async destroyAllServices(): Promise<void> {
    const destroyPromises = this.getAllServices().map(async (service) => {
      try {
        await service.destroy();
        this.logger.log(`${service.platform} service destroyed`);
      } catch (error) {
        this.logger.error(
          `Failed to destroy ${service.platform} service:`,
          error,
        );
      }
    });

    await Promise.all(destroyPromises);
  }
}
