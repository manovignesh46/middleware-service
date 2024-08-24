export abstract class ISmsService {
  abstract sendSmsWithReplacable(
    phoneNumber: string,
    contentName: string,
    replacble: any,
  );
}
