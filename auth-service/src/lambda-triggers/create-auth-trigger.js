import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const region = 'ap-southeast-1';
const snsClient = new SNSClient({ region });
const sesClient = new SESClient({ region });

export const handler = async (event) => {
  console.log('event: ');
  console.log(event);

  console.log('session');
  console.log(event.request.session);
  let otp;
  if (event.request.session.length === 2) {
    // Username password auth complete, generate OTP
    otp = generateOTP();
    await sendSMS(event.request.userAttributes.phone_number, otp);
    if (event.request.userAttributes.email) {
      await sendEmail(event.request.userAttributes.email, otp);
    }
  } else {
    // There's an existing session. Don't generate new digits but
    // re-use the code from the current session. This allows the user to
    // make a mistake when keying in the code and to then retry, rather
    // the needing to e-mail the user an all new code again.
    const previousChallenge = event.request.session.slice(-1)[0];
    otp = previousChallenge.challengeMetadata.match(/CODE-([A-Z]*-\d*)/)[1];
  }

  // This is sent back to the client app
  const otpPrefix = otp.split('-')[0];
  event.response.publicChallengeParameters = {
    otpPrefix,
  };

  // Add the secret login code to the private challenge parameters
  // so it can be verified by the "Verify Auth Challenge Response" trigger
  event.response.privateChallengeParameters = { secretLoginCode: otp };

  // Add the secret login code to the session so it is available
  // in a next invocation of the "Create Auth Challenge" trigger
  event.response.challengeMetadata = `CODE-${otp}`;

  return event;
};

function generateOTP() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase();
  let letters = '';
  for (let i = 0; i < 3; i++) {
    letters += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  const numbers = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');

  const output = `${letters}-${numbers}`;
  return output;
}

async function sendEmail(emailAddress, otp) {
  const params = {
    Destination: { ToAddresses: [emailAddress] },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `<html><body><p>Your OTP is:</p>
                           <h3>${otp}</h3></body></html>`,
        },
        Text: {
          Charset: 'UTF-8',
          Data: `Your secret login code: ${otp}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Your One Time Password',
      },
    },
    Source: process.env.SES_FROM_ADDRESS,
  };
  const command = new SendEmailCommand(params);
  const response = await sesClient.send(command);
  return response;
}

async function sendSMS(phoneNumber, otp) {
  const otpMessage = 'Your OTP is: ' + otp;
  const params = {
    PhoneNumber: phoneNumber,
    Message: otpMessage,
  };

  try {
    const command = new PublishCommand(params);
    const response = await snsClient.send(command);
    console.log('Success. SMS Send Response: ', response);
    return response; // For unit tests.
  } catch (err) {
    console.log(err, err.stack);
  }
}
