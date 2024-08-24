import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { IContentRepository } from '../../domain/repository/content-repository.interface';
import { Content } from '../entities/content.entity';
import { mockContentRepository } from '../repository/mocks/content.repository.mock';
import { ContentService } from './content.service';

describe('ContentService', () => {
  let service: ContentService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        ContentService,
        { provide: IContentRepository, useValue: mockContentRepository },
      ],
    }).compile();
    service = module.get<ContentService>(ContentService);
  });

  it('should parse the preferredName in the message', async () => {
    const mockContent = new Content();
    jest
      .spyOn(mockContentRepository, 'findByContentName')
      .mockResolvedValueOnce({
        ...mockContent,
        messageHeader: 'My Header',
        message: 'Hi ${preferredName}',
      });

    const result = await service.getSubmitLoanSuccessMsg('John');
    expect(result).toEqual({ message: 'Hi John', messageHeader: 'My Header' });
  });
  it('getRepayUpdatedInsufficientFundsMessage should parse the preferredName in the message', async () => {
    const mockContent = new Content();
    jest
      .spyOn(mockContentRepository, 'findByContentName')
      .mockResolvedValueOnce({
        ...mockContent,
        messageHeader: 'My Header',
        message: 'Hi ${preferredName}',
      });

    const result = await service.getRepayUpdatedInsufficientFundsMessage(
      'John',
      '',
      '',
    );
    expect(result).toEqual({ message: 'Hi John', messageHeader: 'My Header' });
  });
  it('getRepayUpdatedInsufficientFundsMessage should parse the preferredName in the message', async () => {
    const mockContent = new Content();
    jest
      .spyOn(mockContentRepository, 'findByContentName')
      .mockResolvedValueOnce({
        ...mockContent,
        messageHeader: 'My Header',
        message: 'Hi ${preferredName}',
      });

    const result = await service.getRepayUpdatedSuccessMessage('John', '', '');
    expect(result).toEqual({ message: 'Hi John', messageHeader: 'My Header' });
  });
  it('getRepayUpdatedInsufficientFundsMessage should parse the preferredName in the message', async () => {
    const mockContent = new Content();
    jest
      .spyOn(mockContentRepository, 'findByContentName')
      .mockResolvedValueOnce({
        ...mockContent,
        messageHeader: 'My Header',
        message: 'Hi ${preferredName}',
      });

    const result = await service.getRepayUpdatedFailedMessage('John', '', '');
    expect(result).toEqual({ message: 'Hi John', messageHeader: 'My Header' });
  });
});
