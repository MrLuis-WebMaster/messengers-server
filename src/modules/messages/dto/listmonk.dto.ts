import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsNumber } from 'class-validator';

export class ListmonkMessageDto {
  @ApiProperty({
    description: 'Message ID from Listmonk',
    example: 'msg_123456',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Campaign ID from Listmonk',
    example: 'camp_789',
  })
  @IsString()
  campaign_id: string;

  @ApiProperty({
    description: 'Subscriber email',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Subscriber name',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Message subject',
    example: 'Welcome to our newsletter!',
  })
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Message content (HTML)',
    example: '<p>Welcome to our newsletter!</p>',
  })
  @IsString()
  body: string;

  @ApiProperty({
    description: 'Message content (plain text)',
    example: 'Welcome to our newsletter!',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Phone number for WhatsApp',
    example: '1234567890',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Slack channel for Slack messages',
    example: '#general',
  })
  @IsString()
  @IsOptional()
  channel?: string;

  @ApiProperty({
    description: 'Message type',
    example: 'whatsapp',
    enum: ['whatsapp', 'slack'],
  })
  @IsString()
  type: 'whatsapp' | 'slack';

  @ApiProperty({
    description: 'Additional metadata',
    example: { list_id: 'list_123', template_id: 'tpl_456' },
  })
  @IsOptional()
  meta?: Record<string, any>;
}
