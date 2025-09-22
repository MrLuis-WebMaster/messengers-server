import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import { AuthResponseDto } from '../../common/dto/auth.dto';

export interface ApiKeyInfo {
  key: string;
  name: string;
  permissions: string[];
  rateLimit: number;
  isActive: boolean;
  createdAt: Date;
  lastUsed?: Date;
}

@Injectable()
export class AuthService {
  private apiKeys: Map<string, ApiKeyInfo> = new Map();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.initializeApiKeys();
  }

  // ===== WEBHOOK AUTHENTICATION =====

  async validateApiKey(apiKey: string): Promise<ApiKeyInfo | null> {
    const keyInfo = this.apiKeys.get(apiKey);

    if (!keyInfo || !keyInfo.isActive) {
      return null;
    }

    // Update last used
    keyInfo.lastUsed = new Date();
    this.apiKeys.set(apiKey, keyInfo);

    return keyInfo;
  }

  async validateWebhookSignature(
    payload: string,
    signature: string,
    secret: string,
  ): Promise<boolean> {
    const expectedSignature = createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return signature === expectedSignature;
  }

  // ===== USER AUTHENTICATION =====

  async validateUser(username: string, password: string): Promise<any> {
    // In production, hash passwords and store in database
    const validUsername =
      this.configService.get<string>('AUTH_USERNAME') || 'admin';
    const validPassword =
      this.configService.get<string>('AUTH_PASSWORD') || 'admin123';

    if (username === validUsername && password === validPassword) {
      return {
        username,
        id: 1,
        roles: ['admin'],
        permissions: ['read', 'write', 'admin'],
      };
    }
    return null;
  }

  async login(user: any): Promise<AuthResponseDto> {
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
      permissions: user.permissions,
    };

    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '1h';
    const expiresInSeconds = this.parseExpirationTime(expiresIn);

    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'Bearer',
      expires_in: expiresInSeconds,
    };
  }

  // ===== API KEY MANAGEMENT =====

  async createApiKey(
    name: string,
    permissions: string[] = ['webhook'],
  ): Promise<ApiKeyInfo> {
    const apiKey = this.generateApiKey();
    const keyInfo: ApiKeyInfo = {
      key: apiKey,
      name,
      permissions,
      rateLimit: 1000, // requests per hour
      isActive: true,
      createdAt: new Date(),
    };

    this.apiKeys.set(apiKey, keyInfo);
    return keyInfo;
  }

  async revokeApiKey(apiKey: string): Promise<boolean> {
    const keyInfo = this.apiKeys.get(apiKey);
    if (keyInfo) {
      keyInfo.isActive = false;
      this.apiKeys.set(apiKey, keyInfo);
      return true;
    }
    return false;
  }

  async getApiKeys(): Promise<ApiKeyInfo[]> {
    return Array.from(this.apiKeys.values());
  }

  // ===== PRIVATE METHODS =====

  private initializeApiKeys(): void {
    // Create default API key for webhooks
    const defaultKey =
      this.configService.get<string>('DEFAULT_API_KEY') ||
      'webhook-default-key';
    this.apiKeys.set(defaultKey, {
      key: defaultKey,
      name: 'Default Webhook Key',
      permissions: ['webhook'],
      rateLimit: 1000,
      isActive: true,
      createdAt: new Date(),
    });
  }

  private generateApiKey(): string {
    return 'mp_' + require('crypto').randomBytes(32).toString('hex');
  }

  private parseExpirationTime(expiration: string): number {
    const unit = expiration.slice(-1);
    const value = parseInt(expiration.slice(0, -1));

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 3600; // Default to 1 hour
    }
  }
}
