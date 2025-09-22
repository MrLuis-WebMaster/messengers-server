import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKey(request);

    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    const keyInfo = await this.authService.validateApiKey(apiKey);

    if (!keyInfo) {
      throw new UnauthorizedException('Invalid or inactive API key');
    }

    // Attach key info to request
    request.user = {
      type: 'api-key',
      keyInfo,
      permissions: keyInfo.permissions,
    };

    return true;
  }

  private extractApiKey(request: any): string | null {
    // Check Authorization header: Bearer <api-key>
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check X-API-Key header
    if (request.headers['x-api-key']) {
      return request.headers['x-api-key'];
    }

    // Check query parameter
    if (request.query.api_key) {
      return request.query.api_key;
    }

    return null;
  }
}
