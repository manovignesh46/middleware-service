export abstract class IContentService {
  abstract getOnboardingRejectedByFurahaMsg(
    preferredName: string,
    rejectionReason: string,
  ): Promise<{ message: string; messageHeader: string }>;

  abstract getForgotPinIncorrectDetails(
    preferredName: string,
  ): Promise<{ message: string; messageHeader: string }>;

  abstract getOptOutMessageDetails(): Promise<{
    message: string;
    messageHeader: string;
  }>;
}
