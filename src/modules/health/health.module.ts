import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { MessagingFactoryService } from '../../common/services/messaging-factory.service';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { SlackModule } from '../slack/slack.module';

@Module({
  imports: [WhatsappModule, SlackModule],
  controllers: [HealthController],
  providers: [HealthService, MessagingFactoryService],
})
export class HealthModule {}
