import { MessageType, Platform } from '../dto/message.dto';

export interface MessageRequest {
  to: string;
  message: string;
  type: MessageType;
  platform: Platform;
  mediaUrl?: string;
  caption?: string;
  filename?: string;
}

export interface MessageResponse {
  success: boolean;
  messageId?: string;
  message?: string;
  error?: string;
  timestamp: string;
  platform: Platform;
}

export interface PlatformStatus {
  isConnected: boolean;
  platform: Platform;
  lastSeen?: Date;
  qrCode?: string; // For WhatsApp
  phoneNumber?: string; // For WhatsApp
  workspaceName?: string; // For Slack
  error?: string;
}

export interface MessagingService {
  readonly platform: Platform;

  /**
   * Initialize the messaging service
   */
  initialize(): Promise<void>;

  /**
   * Send a message
   */
  sendMessage(request: MessageRequest): Promise<MessageResponse>;

  /**
   * Get platform status
   */
  getStatus(): Promise<PlatformStatus>;

  /**
   * Check if service is ready
   */
  isReady(): boolean;

  /**
   * Cleanup resources
   */
  destroy(): Promise<void>;

  /**
   * Validate message request for this platform
   */
  validateMessage(request: MessageRequest): Promise<boolean>;
}
