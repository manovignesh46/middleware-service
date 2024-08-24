import { Injectable } from '@nestjs/common';
import { IContent } from '../../domain/model/content.interface';
import { IContentRepository } from '../../domain/repository/contentRepository.interface';
import { IContentService } from '../../domain/services/content.service.interface';

@Injectable()
export class ContentService implements IContentService {
  constructor(private readonly contentRepository: IContentRepository) {}

  async getOptOutMessageDetails(): Promise<{
    message: string;
    messageHeader: string;
  }> {
    const content: IContent = await this.contentRepository.findByContentName(
      'MTN_OPT_OUT_DETAILS',
    );
    return {
      message: content.message,
      messageHeader: content.messageHeader,
    };
  }
  async getForgotPinIncorrectDetails(
    preferredName: string,
  ): Promise<{ message: string; messageHeader: string }> {
    const content: IContent = await this.contentRepository.findByContentName(
      'FORGOT_PIN_INCORRECT_DETAILS',
    );
    return {
      message: content.message.replace(
        '${preferredName}',
        preferredName || 'valued customer',
      ),
      messageHeader: content.messageHeader,
    };
  }

  async getOnboardingRejectedByFurahaMsg(
    preferredName: string,
    rejectionReason: string,
  ): Promise<{ message: string; messageHeader: string }> {
    const content: IContent = await this.contentRepository.findByContentName(
      'ONBOARDING_REJECTED_BY_FURAHA',
    );
    return {
      message: content.message
        .replace('${preferredName}', preferredName || 'valued customer')
        .replace('${rejectionReason}', rejectionReason || 'internal processes'),
      messageHeader: content.messageHeader,
    };
  }
}
