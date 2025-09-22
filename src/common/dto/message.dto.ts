import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsUrl,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  DOCUMENT = 'document',
  AUDIO = 'audio',
  VIDEO = 'video',
}

export enum Platform {
  WHATSAPP = 'whatsapp',
  SLACK = 'slack',
}

export class SendMessageDto {
  @ApiProperty({
    description: 'Phone number or Slack channel/user ID',
    example: '1234567890',
    pattern: '^[0-9]+$',
  })
  @IsString()
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only digits' })
  @MinLength(10, { message: 'Phone number must be at least 10 digits' })
  @MaxLength(15, { message: 'Phone number must be at most 15 digits' })
  to: string;

  @ApiProperty({
    description: 'Message content',
    example: 'Hello from the messaging platform!',
    minLength: 1,
    maxLength: 4096,
  })
  @IsString()
  @MinLength(1, { message: 'Message cannot be empty' })
  @MaxLength(4096, { message: 'Message cannot exceed 4096 characters' })
  message: string;

  @ApiProperty({
    description: 'Target platform',
    enum: Platform,
    example: Platform.WHATSAPP,
  })
  @IsEnum(Platform)
  platform: Platform;

  @ApiPropertyOptional({
    description: 'Message type',
    enum: MessageType,
    default: MessageType.TEXT,
    example: MessageType.TEXT,
  })
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType = MessageType.TEXT;

  @ApiPropertyOptional({
    description: 'Media URL for media messages',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Media URL must be a valid URL' })
  mediaUrl?: string;

  @ApiPropertyOptional({
    description: 'Caption for media messages',
    example: 'Check out this image!',
    maxLength: 1024,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024, { message: 'Caption cannot exceed 1024 characters' })
  caption?: string;

  @ApiPropertyOptional({
    description: 'Filename for document messages',
    example: 'document.pdf',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Filename cannot exceed 255 characters' })
  filename?: string;
}

export class MessageResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiPropertyOptional({
    description: 'Message ID from the platform',
    example: '3EB0C767D26A8B71D7E5E8A2',
  })
  messageId?: string;

  @ApiPropertyOptional({
    description: 'Response message',
    example: 'Message sent successfully',
  })
  message?: string;

  @ApiPropertyOptional({
    description: 'Error message if failed',
    example: 'Failed to send message',
  })
  error?: string;

  @ApiProperty({
    description: 'Response timestamp',
    example: '2023-12-01T10:30:00.000Z',
  })
  timestamp: string;
}
