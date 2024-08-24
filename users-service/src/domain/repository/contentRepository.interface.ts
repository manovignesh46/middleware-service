import { IContent } from '../model/content.interface';

export abstract class IContentRepository {
  abstract findByContentName(contentName: string): Promise<IContent>;
}
