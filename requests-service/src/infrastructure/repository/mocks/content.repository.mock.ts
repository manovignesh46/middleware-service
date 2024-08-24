import { IContent } from '../../../domain/model/content.interface';
import { mockContent } from '../../../domain/model/mocks/content.mock';
import { IContentRepository } from '../../../domain/repository/content-repository.interface';

export const mockContentRepository: IContentRepository = {
  findByContentName(contentName: string): Promise<IContent> {
    return Promise.resolve({ ...mockContent, contentName });
  },
};
