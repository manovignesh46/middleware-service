export abstract class IRequestServiceClient {
  abstract cancelExistingWorkflow(custId: string): Promise<boolean>;
}
