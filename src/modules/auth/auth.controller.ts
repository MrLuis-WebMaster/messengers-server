import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Delete,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto, AuthResponseDto } from '../../common/dto/auth.dto';
import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Authenticate user and get JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful',
    type: AuthResponseDto,
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      token_type: 'Bearer',
      expires_in: 3600,
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    example: {
      success: false,
      error: 'Invalid credentials',
      timestamp: '2023-12-01T10:30:00.000Z',
    },
  })
  async login(
    @Request() req,
    @Body() loginDto: LoginDto,
  ): Promise<AuthResponseDto> {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Get('api-keys')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all API keys (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'API keys retrieved successfully',
  })
  async getApiKeys(@Request() req) {
    return this.authService.getApiKeys();
  }

  @Post('api-keys')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new API key' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Webhook Integration' },
        permissions: {
          type: 'array',
          items: { type: 'string' },
          example: ['webhook', 'read'],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'API key created successfully',
  })
  async createApiKey(
    @Request() req,
    @Body() body: { name: string; permissions?: string[] },
  ) {
    return this.authService.createApiKey(body.name, body.permissions);
  }

  @Delete('api-keys/:key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke API key' })
  @ApiResponse({
    status: 200,
    description: 'API key revoked successfully',
  })
  async revokeApiKey(@Request() req, @Param('key') key: string) {
    const success = await this.authService.revokeApiKey(key);
    return {
      success,
      message: success ? 'API key revoked' : 'API key not found',
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  async getProfile(@Request() req) {
    return {
      user: req.user,
      timestamp: new Date().toISOString(),
    };
  }
}
