import { Logger } from '@nestjs/common';
import { IEmailService } from '../../domain/services/emailService.interface';

export class EmailService implements IEmailService {
  private readonly logger = new Logger(EmailService.name);
  sendEmail(recipientEmail: string, senderEmail: string, message: string) {
    this.logger.log(this.sendEmail.name);
  }
}
