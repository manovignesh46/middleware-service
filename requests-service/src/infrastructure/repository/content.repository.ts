import { Injectable } from '@nestjs/common';
import { IContent } from '../../domain/model/content.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from '../entities/content.entity';
import { IContentRepository } from '../../domain/repository/content-repository.interface';

@Injectable()
export class ContentRepository implements IContentRepository {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<IContent>,
  ) {}

  findByContentName(contentName: string): Promise<IContent> {
    return this.contentRepository.findOneOrFail({ where: { contentName } });
  }
}
