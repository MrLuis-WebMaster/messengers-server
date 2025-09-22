import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, MessageMedia, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
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

  private client: Client | null = null;
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

    // Check if running in Railway environment
    if (isRailwayEnvironment()) {
      this.logger.warn('WhatsApp service disabled in Railway environment due to Puppeteer limitations');
      this.status.error = 'WhatsApp service disabled in Railway environment';
      this.isInitialized = true;
      return;
    }

    try {
      this.logger.log('Initializing WhatsApp service...');

      this.client = new Client({
        authStrategy: new LocalAuth({
          clientId:
            this.configService.get<string>('WHATSAPP_SESSION_NAME') ||
            'whatsapp-session',
        }),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu',
          ],
        },
      });

      this.setupEventHandlers();
      await this.client.initialize();
      this.isInitialized = true;

      this.logger.log('WhatsApp service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize WhatsApp service:', error);
      this.status.error = error.message;
      throw error;
    }
  }

  private setupEventHandlers(): void {
    if (!this.client) return;

    this.client.on('qr', (qr) => {
      this.logger.log('QR Code received, scan with WhatsApp mobile app');
      qrcode.generate(qr, { small: true });
      this.status.qrCode = qr;
      this.emit('qr', qr);
    });

    this.client.on('ready', () => {
      this.logger.log('WhatsApp client is ready!');
      this.status.isConnected = true;
      this.status.qrCode = undefined;
      this.status.lastSeen = new Date();
      this.emit('ready');
    });

    this.client.on('authenticated', () => {
      this.logger.log('WhatsApp client authenticated');
      this.status.isConnected = true;
      this.status.lastSeen = new Date();
      this.emit('authenticated');
    });

    this.client.on('auth_failure', (msg) => {
      this.logger.error('Authentication failed:', msg);
      this.status.isConnected = false;
      this.status.error = msg;
      this.emit('auth_failure', msg);
    });

    this.client.on('disconnected', (reason) => {
      this.logger.warn('WhatsApp client disconnected:', reason);
      this.status.isConnected = false;
      this.status.error = reason;
      this.emit('disconnected', reason);
    });

    this.client.on('message', async (message) => {
      this.logger.log(`Received message from ${message.from}: ${message.body}`);
      this.emit('message', message);
    });
  }

  async sendMessage(request: MessageRequest): Promise<MessageResponse> {
    // Check if running in Railway environment
    if (isRailwayEnvironment()) {
      return {
        success: false,
        error: 'WhatsApp service is disabled in Railway environment. Consider using an external WhatsApp service.',
        timestamp: new Date().toISOString(),
        platform: this.platform,
      };
    }

    if (!this.client || !this.status.isConnected) {
      return {
        success: false,
        error: 'WhatsApp client not connected',
        timestamp: new Date().toISOString(),
        platform: this.platform,
      };
    }

    try {
      const chatId = request.to.includes('@c.us')
        ? request.to
        : `${request.to}@c.us`;

      let message;

      switch (request.type) {
        case MessageType.IMAGE:
        case MessageType.DOCUMENT:
        case MessageType.AUDIO:
        case MessageType.VIDEO:
          if (!request.mediaUrl) {
            return {
              success: false,
              error: 'Media URL is required for media messages',
              timestamp: new Date().toISOString(),
              platform: this.platform,
            };
          }
          const media = await MessageMedia.fromUrl(request.mediaUrl);
          if (request.caption) {
            (media as any).caption = request.caption;
          }
          if (request.filename) {
            (media as any).filename = request.filename;
          }
          message = await this.client.sendMessage(chatId, media);
          break;

        default:
          message = await this.client.sendMessage(chatId, request.message);
      }

      this.logger.log(
        `Message sent successfully to ${request.to}, ID: ${message.id._serialized}`,
      );

      return {
        success: true,
        messageId: message.id._serialized,
        message: 'Message sent successfully',
        timestamp: new Date().toISOString(),
        platform: this.platform,
      };
    } catch (error) {
      this.logger.error('Failed to send message:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
        platform: this.platform,
      };
    }
  }

  async getStatus(): Promise<PlatformStatus> {
    return { ...this.status };
  }

  isReady(): boolean {
    return this.isInitialized && this.status.isConnected;
  }

  async destroy(): Promise<void> {
    if (this.client) {
      try {
        await this.client.destroy();
        this.logger.log('WhatsApp client destroyed');
      } catch (error) {
        this.logger.error('Error destroying WhatsApp client:', error);
      }
    }
    this.isInitialized = false;
    this.status.isConnected = false;
  }

  async validateMessage(request: MessageRequest): Promise<boolean> {
    // WhatsApp specific validation
    if (!request.to || !/^[0-9]+$/.test(request.to)) {
      return false;
    }

    if (request.type !== MessageType.TEXT && !request.mediaUrl) {
      return false;
    }

    return true;
  }
}
