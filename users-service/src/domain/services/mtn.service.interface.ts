export abstract class IMtnService {
  abstract optIn(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<{ approvalid: string; externalRequestId: string }>;
}
