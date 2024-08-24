import { LOSOutcomeDTO } from '../../infrastructure/controllers/customers/dtos/losOutcome.dto';
import { RunWorkFlowDTO } from '../../infrastructure/controllers/customers/dtos/runApiLOSOutcome.dto';

export abstract class ILOSService {
  abstract runWorkFlow(runWorkFlowDTO: RunWorkFlowDTO): Promise<any>;
  abstract interactionOutcome(
    secondaryUUID: string,
    losOutcomeDTO: LOSOutcomeDTO,
  ): Promise<boolean>;

  abstract interactionTarget(uuid: string): Promise<any>;

  abstract cancelWorkflow(fullMsisdn: string, reason?: string): Promise<any>;

  abstract getCustomerLoans(dataToCRM: any): Promise<any>;
}
