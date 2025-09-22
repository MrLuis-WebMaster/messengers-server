import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { HealthCheckDto } from '../../common/dto/health.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Check the health status of the messaging platform API',
  })
  @ApiResponse({
    status: 200,
    description: 'Health check completed',
    type: HealthCheckDto,
  })
  @ApiResponse({
    status: 503,
    description: 'Service unhealthy',
    type: HealthCheckDto,
  })
  async getHealthCheck(): Promise<HealthCheckDto> {
    return await this.healthService.getHealthCheck();
  }
}
