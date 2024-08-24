import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { IContentRepository } from '../../domain/repository/contentRepository.interface';
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

  it('getOptOutMessageDetailsin the message', async () => {
    const mockContent = new Content();
    jest
      .spyOn(mockContentRepository, 'findByContentName')
      .mockResolvedValueOnce({
        ...mockContent,
        messageHeader: 'My Header',
        message: 'Hi John. replaced rejection reason',
      });

    const result = await service.getOptOutMessageDetails();
    expect(result).toEqual({
      message: 'Hi John. replaced rejection reason',
      messageHeader: 'My Header',
    });
  });

  it('getForgotPinIncorrectDetails the message', async () => {
    const mockContent = new Content();
    jest
      .spyOn(mockContentRepository, 'findByContentName')
      .mockResolvedValueOnce({
        ...mockContent,
        messageHeader: 'My Header',
        message: 'Hi ${preferredName}. replaced rejection reason',
      });

    const result = await service.getForgotPinIncorrectDetails('John');
    expect(result).toEqual({
      message: 'Hi John. replaced rejection reason',
      messageHeader: 'My Header',
    });
  });

  it('should parse the preferredName in the message', async () => {
    const mockContent = new Content();
    jest
      .spyOn(mockContentRepository, 'findByContentName')
      .mockResolvedValueOnce({
        ...mockContent,
        messageHeader: 'My Header',
        message: 'Hi ${preferredName}. ${rejectionReason}',
      });

    const result = await service.getOnboardingRejectedByFurahaMsg(
      'John',
      'replaced rejection reason',
    );
    expect(result).toEqual({
      message: 'Hi John. replaced rejection reason',
      messageHeader: 'My Header',
    });
  });
});
