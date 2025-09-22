import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebClient } from '@slack/web-api';
import {
  MessagingService,
  MessageRequest,
  MessageResponse,
  PlatformStatus,
} from '../../common/interfaces/messaging.interface';
import { Platform, MessageType } from '../../common/dto/message.dto';

@Injectable()
export class SlackService implements MessagingService {
  private readonly logger = new Logger(SlackService.name);
  public readonly platform = Platform.SLACK;

  private client: WebClient | null = null;
  private isInitialized = false;
  private status: PlatformStatus = {
    isConnected: false,
    platform: this.platform,
  };

  constructor(private configService: ConfigService) {}

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.logger.log('Initializing Slack service...');

      const botToken = this.configService.get<string>('SLACK_BOT_TOKEN');

      if (!botToken) {
        throw new Error('SLACK_BOT_TOKEN is required');
      }

      this.client = new WebClient(botToken);

      // Test the connection
      const authTest = await this.client.auth.test();

      if (!authTest.ok) {
        throw new Error(`Slack authentication failed: ${authTest.error}`);
      }

      this.status.isConnected = true;
      this.status.workspaceName = authTest.team;
      this.status.lastSeen = new Date();
      this.isInitialized = true;

      this.logger.log(
        `Slack service initialized successfully for workspace: ${authTest.team}`,
      );
    } catch (error) {
      this.logger.error('Failed to initialize Slack service:', error);
      this.status.error = error.message;
      throw error;
    }
  }

  async sendMessage(request: MessageRequest): Promise<MessageResponse> {
    if (!this.client || !this.status.isConnected) {
      return {
        success: false,
        error: 'Slack client not connected',
        timestamp: new Date().toISOString(),
        platform: this.platform,
      };
    }

    try {
      let result;

      switch (request.type) {
        case MessageType.IMAGE:
          result = await this.sendImageMessage(request);
          break;
        case MessageType.DOCUMENT:
          result = await this.sendFileMessage(request);
          break;
        default:
          result = await this.sendTextMessage(request);
      }

      this.logger.log(`Message sent successfully to ${request.to}`);

      return {
        success: true,
        messageId: result.ts,
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

  private async sendTextMessage(request: MessageRequest) {
    if (!this.client) {
      throw new Error('Slack client not initialized');
    }
    return await this.client.chat.postMessage({
      channel: request.to,
      text: request.message,
    });
  }

  private async sendImageMessage(request: MessageRequest) {
    if (!this.client) {
      throw new Error('Slack client not initialized');
    }

    if (!request.mediaUrl) {
      throw new Error('Media URL is required for image messages');
    }

    // For images, we can use blocks for better formatting
    const blocks: any[] = [
      {
        type: 'image',
        image_url: request.mediaUrl,
        alt_text: request.caption || 'Image',
      },
    ];

    if (request.caption) {
      blocks.unshift({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: request.caption,
        },
      });
    }

    return await this.client.chat.postMessage({
      channel: request.to,
      blocks: blocks,
    });
  }

  private async sendFileMessage(request: MessageRequest) {
    if (!this.client) {
      throw new Error('Slack client not initialized');
    }

    if (!request.mediaUrl) {
      throw new Error('Media URL is required for file messages');
    }

    // For files, we'll send as a link with description
    const text = request.caption
      ? `📎 *${request.filename || 'File'}*\n${request.caption}\n${request.mediaUrl}`
      : `📎 *${request.filename || 'File'}*\n${request.mediaUrl}`;

    return await this.client.chat.postMessage({
      channel: request.to,
      text: text,
    });
  }

  async getStatus(): Promise<PlatformStatus> {
    return { ...this.status };
  }

  isReady(): boolean {
    return this.isInitialized && this.status.isConnected;
  }

  async destroy(): Promise<void> {
    // Slack WebClient doesn't need explicit cleanup
    this.client = null;
    this.isInitialized = false;
    this.status.isConnected = false;
    this.logger.log('Slack service destroyed');
  }

  async validateMessage(request: MessageRequest): Promise<boolean> {
    // Slack specific validation
    if (!request.to) {
      return false;
    }

    // Channel/user ID should start with # or @ or be a valid ID
    if (
      !request.to.startsWith('#') &&
      !request.to.startsWith('@') &&
      !request.to.startsWith('C') &&
      !request.to.startsWith('U')
    ) {
      return false;
    }

    if (request.type !== MessageType.TEXT && !request.mediaUrl) {
      return false;
    }

    return true;
  }
}
