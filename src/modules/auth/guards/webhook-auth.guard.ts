import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';

@Injectable()
export class WebhookAuthGuard extends AuthGuard('api-key') {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Check if webhook signature validation is required
    const requireSignature = this.reflector.get<boolean>(
      'requireWebhookSignature',
      context.getHandler(),
    );

    if (requireSignature) {
      const signature = request.headers['x-webhook-signature'];
      const payload = JSON.stringify(request.body);
      const secret = process.env.WEBHOOK_SECRET || 'webhook-secret';

      if (!signature) {
        throw new UnauthorizedException('Webhook signature is required');
      }

      const isValidSignature = await this.authService.validateWebhookSignature(
        payload,
        signature,
        secret,
      );

      if (!isValidSignature) {
        throw new UnauthorizedException('Invalid webhook signature');
      }
    }

    // Call parent canActivate for API key validation
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid API key for webhook');
    }
    return user;
  }
}
