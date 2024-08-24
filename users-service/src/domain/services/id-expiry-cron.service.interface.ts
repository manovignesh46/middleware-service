export abstract class IIdExpiryCronService {
  abstract sendNotificationForExpiredIds(): void;
}
