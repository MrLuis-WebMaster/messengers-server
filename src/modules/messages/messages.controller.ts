import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiSecurity,
  ApiParam,
} from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  SendMessageDto,
  MessageResponseDto,
  Platform,
} from '../../common/dto/message.dto';
import { ListmonkMessageDto } from './dto/listmonk.dto';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post('send')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send message via webhook',
    description:
      'Send a message to WhatsApp or Slack using API key authentication',
  })
  @ApiResponse({
    status: 200,
    description: 'Message sent successfully',
    type: MessageResponseDto,
    example: {
      success: true,
      messageId: '3EB0C767D26A8B71D7E5E8A2',
      message: 'Message sent successfully',
      timestamp: '2023-12-01T10:30:00.000Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request or service not ready',
    example: {
      success: false,
      error: 'WhatsApp service is not ready',
      timestamp: '2023-12-01T10:30:00.000Z',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid API key',
    example: {
      success: false,
      error: 'Invalid or inactive API key',
      timestamp: '2023-12-01T10:30:00.000Z',
    },
  })
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<MessageResponseDto> {
    return await this.messagesService.sendMessage(sendMessageDto);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get status of all platforms',
    description: 'Get connection status for all messaging platforms',
  })
  @ApiResponse({
    status: 200,
    description: 'Platform status retrieved successfully',
  })
  async getAllPlatformsStatus() {
    const statusMap = await this.messagesService.getAllPlatformsStatus();
    const statusObject = Object.fromEntries(statusMap);

    return {
      success: true,
      data: statusObject,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('status/:platform')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get status of specific platform',
    description: 'Get connection status for a specific messaging platform',
  })
  @ApiParam({
    name: 'platform',
    enum: Platform,
    description: 'Platform to check status for',
  })
  @ApiResponse({
    status: 200,
    description: 'Platform status retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid platform',
  })
  async getPlatformStatus(@Param('platform') platform: Platform) {
    const status = await this.messagesService.getPlatformStatus(platform);

    return {
      success: true,
      data: status,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('platforms')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get available platforms',
    description: 'Get list of all available messaging platforms',
  })
  @ApiResponse({
    status: 200,
    description: 'Available platforms retrieved successfully',
  })
  async getAvailablePlatforms() {
    const platforms = await this.messagesService.getAvailablePlatforms();

    return {
      success: true,
      data: platforms,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('initialize')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Initialize all platforms',
    description: 'Initialize all messaging platform services',
  })
  @ApiResponse({
    status: 200,
    description: 'All platforms initialized successfully',
  })
  async initializeAllPlatforms() {
    await this.messagesService.initializeAllPlatforms();

    return {
      success: true,
      message: 'All platforms initialized successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('listmonk')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send message via Listmonk webhook',
    description: 'Endpoint specifically designed for Listmonk integration',
  })
  @ApiResponse({
    status: 200,
    description: 'Message sent successfully via Listmonk',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Listmonk data',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid API key',
  })
  async sendListmonkMessage(
    @Body() listmonkData: ListmonkMessageDto,
  ): Promise<MessageResponseDto> {
    return await this.messagesService.sendListmonkMessage(listmonkData);
  }
}