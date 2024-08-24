import { LOSOutcomeDTO } from '../../infrastructure/controllers/requests/dtos/losOutcome.dto';

export abstract class ILOSService {
  abstract interactionOutcome(
    secondaryUUID: string,
    losOutcomeDto: LOSOutcomeDTO,
  ): Promise<boolean>;

  abstract interactionTarget(uuid: string): Promise<any>;
}
