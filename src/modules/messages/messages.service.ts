import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { MessagingFactoryService } from '../../common/services/messaging-factory.service';
import {
  MessageRequest,
  MessageResponse,
} from '../../common/interfaces/messaging.interface';
import {
  SendMessageDto,
  Platform,
  MessageType,
} from '../../common/dto/message.dto';
import { ListmonkMessageDto } from './dto/listmonk.dto';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(private messagingFactory: MessagingFactoryService) {}

  async sendMessage(sendMessageDto: SendMessageDto): Promise<MessageResponse> {
    try {
      // Convert DTO to internal request format
      const request: MessageRequest = {
        to: sendMessageDto.to,
        message: sendMessageDto.message,
        type: sendMessageDto.type || MessageType.TEXT,
        platform: sendMessageDto.platform,
        mediaUrl: sendMessageDto.mediaUrl,
        caption: sendMessageDto.caption,
        filename: sendMessageDto.filename,
      };

      // Get the appropriate service
      const service = this.messagingFactory.getService(sendMessageDto.platform);

      // Validate the message for the specific platform
      const isValid = await service.validateMessage(request);
      if (!isValid) {
        throw new BadRequestException(
          `Invalid message format for ${sendMessageDto.platform}`,
        );
      }

      // Check if service is ready
      if (!service.isReady()) {
        throw new BadRequestException(
          `${sendMessageDto.platform} service is not ready`,
        );
      }

      // Send the message
      const result = await service.sendMessage(request);

      this.logger.log(
        `Message sent via ${sendMessageDto.platform} to ${sendMessageDto.to}`,
      );

      return result;
    } catch (error) {
      this.logger.error('Failed to send message:', error);

      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        timestamp: new Date().toISOString(),
        platform: sendMessageDto.platform,
      };
    }
  }

  async getPlatformStatus(platform: Platform): Promise<any> {
    try {
      const service = this.messagingFactory.getService(platform);
      return await service.getStatus();
    } catch (error) {
      this.logger.error(`Failed to get status for ${platform}:`, error);
      return {
        platform,
        isConnected: false,
        error: error.message,
      };
    }
  }

  async getAllPlatformsStatus(): Promise<Map<Platform, any>> {
    return await this.messagingFactory.getAllServicesStatus();
  }

  async getAvailablePlatforms(): Promise<Platform[]> {
    return this.messagingFactory.getAvailablePlatforms();
  }

  async initializeAllPlatforms(): Promise<void> {
    await this.messagingFactory.initializeAllServices();
  }

  async destroyAllPlatforms(): Promise<void> {
    await this.messagingFactory.destroyAllServices();
  }

  async sendListmonkMessage(listmonkData: ListmonkMessageDto): Promise<MessageResponse> {
    try {
      this.logger.log('Processing Listmonk message:', {
        id: listmonkData.id,
        type: listmonkData.type,
        email: listmonkData.email,
      });

      // Convert Listmonk data to internal message format
      const messageRequest: MessageRequest = {
        to: listmonkData.type === 'whatsapp' 
          ? (listmonkData.phone || listmonkData.email) 
          : (listmonkData.channel || '#general'),
        message: this.formatListmonkMessage(listmonkData),
        type: MessageType.TEXT,
        platform: listmonkData.type === 'whatsapp' ? Platform.WHATSAPP : Platform.SLACK,
      };

      // Get the appropriate service
      const service = this.messagingFactory.getService(messageRequest.platform);

      // Validate the message
      const isValid = await service.validateMessage(messageRequest);
      if (!isValid) {
        throw new BadRequestException(`Invalid message format for ${messageRequest.platform}`);
      }

      // Check if service is ready
      if (!service.isReady()) {
        throw new BadRequestException(`${messageRequest.platform} service is not ready`);
      }

      // Send the message
      const result = await service.sendMessage(messageRequest);

      this.logger.log(`Listmonk message sent via ${messageRequest.platform}`, {
        listmonkId: listmonkData.id,
        campaignId: listmonkData.campaign_id,
      });

      return result;

    } catch (error) {
      this.logger.error('Failed to send Listmonk message:', error);
      
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        timestamp: new Date().toISOString(),
        platform: listmonkData.type === 'whatsapp' ? Platform.WHATSAPP : Platform.SLACK,
      };
    }
  }

  private formatListmonkMessage(data: ListmonkMessageDto): string {
    const platform = data.type === 'whatsapp' ? 'WhatsApp' : 'Slack';
    
    return `📧 *${data.subject}*

${data.text}

---
*Enviado via ${platform} desde Listmonk*
*ID: ${data.id} | Campaña: ${data.campaign_id}*`;
  }
}
