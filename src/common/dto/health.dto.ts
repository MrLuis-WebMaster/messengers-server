import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckDto {
  @ApiProperty({
    description: 'Overall health status',
    example: 'healthy',
    enum: ['healthy', 'unhealthy'],
  })
  status: 'healthy' | 'unhealthy';

  @ApiProperty({
    description: 'Service uptime in seconds',
    example: 3600,
  })
  uptime: number;

  @ApiProperty({
    description: 'Health check timestamp',
    example: '2023-12-01T10:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Individual service status',
    example: {
      whatsapp: true,
      slack: true,
      database: false,
    },
  })
  services: {
    whatsapp: boolean;
    slack: boolean;
    database?: boolean;
  };
}
