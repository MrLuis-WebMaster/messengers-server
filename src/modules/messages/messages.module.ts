import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagingFactoryService } from '../../common/services/messaging-factory.service';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { SlackModule } from '../slack/slack.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [WhatsappModule, SlackModule, AuthModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessagingFactoryService],
  exports: [MessagesService],
})
export class MessagesModule {}
