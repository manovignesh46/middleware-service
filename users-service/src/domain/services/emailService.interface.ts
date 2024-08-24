export abstract class IEmailService {
  abstract sendEmail(
    recipientEmail: string,
    senderEmail: string,
    message: string,
  );
}
