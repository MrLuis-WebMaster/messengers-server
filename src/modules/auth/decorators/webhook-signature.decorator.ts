import { SetMetadata } from '@nestjs/common';

export const REQUIRE_WEBHOOK_SIGNATURE_KEY = 'requireWebhookSignature';
export const RequireWebhookSignature = () =>
  SetMetadata(REQUIRE_WEBHOOK_SIGNATURE_KEY, true);
