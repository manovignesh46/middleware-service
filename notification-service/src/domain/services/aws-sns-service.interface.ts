export abstract class ISNSService {
  abstract sendSMS(phoneNumber: string, message: string);
  abstract sendPushNotification(
    pushId: string,
    endpointArn: string,
    message: string,
    messageHeader?: string,
  );
  abstract sendToTopic(topicArn: string, message: string);
  abstract isValidEndpointArn(endpointArn: string): Promise<boolean>;
  abstract isValidTopicArn(topicArn: string);
}
