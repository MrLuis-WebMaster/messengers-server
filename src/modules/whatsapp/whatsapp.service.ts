import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter } from 'events';
import {
  MessagingService,
  MessageRequest,
  MessageResponse,
  PlatformStatus,
} from '../../common/interfaces/messaging.interface';
import { Platform, MessageType } from '../../common/dto/message.dto';
import { isRailwayEnvironment } from '../../config/railway.config';

@Injectable()
export class WhatsappService extends EventEmitter implements MessagingService {
  private readonly logger = new Logger(WhatsappService.name);
  public readonly platform = Platform.WHATSAPP;

  private isInitialized = false;
  private status: PlatformStatus = {
    isConnected: false,
    platform: this.platform,
  };

  constructor(private configService: ConfigService) {
    super();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // WhatsApp service is disabled in Railway environment
    this.logger.warn('WhatsApp service disabled in Railway environment due to Puppeteer limitations');
    this.status.error = 'WhatsApp service disabled in Railway environment. Use external WhatsApp service.';
    this.isInitialized = true;
  }

  async sendMessage(request: MessageRequest): Promise<MessageResponse> {
    return {
      success: false,
      error: 'WhatsApp service is disabled in Railway environment. Use external WhatsApp service.',
      timestamp: new Date().toISOString(),
      platform: this.platform,
    };
  }

  async getStatus(): Promise<PlatformStatus> {
    return { ...this.status };
  }

  isReady(): boolean {
    return false; // Always false in Railway
  }

  async destroy(): Promise<void> {
    this.isInitialized = false;
    this.status.isConnected = false;
  }

  async validateMessage(request: MessageRequest): Promise<boolean> {
    return false; // Always false in Railway
  }
}
