import { Test } from '@nestjs/testing';
import { IEmailService } from '../../domain/services/emailService.interface';
import { EmailService } from './email.service';

describe('emailService', () => {
  let service: IEmailService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });
  it('should be defined', () => {
    service.sendEmail('recipient@email.com', 'sender@email.com', 'hello world');
    expect(service).toBeDefined();
  });
});
