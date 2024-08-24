import { Injectable, Logger } from '@nestjs/common';
import { ISanctionService } from '../domain/services/sanctionService.interface';
import { IRefinitiveService } from '../domain/services/refinitiveService.interface';

/* istanbul ignore next */
@Injectable()
export class SanctionService implements ISanctionService {
  constructor(private readonly refinitiveService: IRefinitiveService) {}

  private readonly logger = new Logger(SanctionService.name);
  getSanctionDetails(name: string) {
    this.logger.log(this.getSanctionDetails.name);
    try {
      return this.refinitiveService.getSanctionDetails(name);
    } catch (err) {
      this.logger.error(err.stack);
      throw err;
    }
  }
}
