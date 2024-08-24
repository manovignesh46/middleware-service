import * as crypto from 'crypto';

/**
 * Generates object that contains authorization headers (Date, Authorization, Content-Type, Content-Length).
 *
 * @param apiKey User's API key.
 * @param apiSecret User's API secret key.
 * @param method HTTP method of a request (e.g. 'get', 'options', 'head', 'post', 'put', 'patch', or 'delete').
 * @param url Full form URL (e.g. 'https://www.example.com/resources').
 * @param contentType (optional) Content type header value (e.g. 'application/json').
 * @param payload (optional) Object representing content.
 * @returns {{Authorization: string, Date: string}} (optional) Content-Type: string, (optional) Content-Length: number.
 */
export function generateAuthorizationHeaders(
  apiKey: string,
  apiSecret: string,
  method: string,
  url: string,
  contentType: string,
  payload: string,
): any {
  validatePayload(contentType, payload);

  const date = getDate();
  const authorization = generateAuthorizationHeader(
    apiKey,
    apiSecret,
    method,
    url,
    contentType,
    payload,
    date,
  );
  const authorizationHeaders = {
    Date: date,
    Authorization: authorization,
  };
  if (!!payload) {
    authorizationHeaders['Content-Type'] = contentType;
    authorizationHeaders['Content-Length'] = payload.length;
  }

  return authorizationHeaders;
}

function validatePayload(contentType: string, payload) {
  if (
    contentType != null &&
    !contentType.toString().startsWith('application/json')
  ) {
    throw new Error('Unsupported content type: ' + contentType);
  }
  if (payload == null && contentType != null) {
    throw new Error('The request payload (body) has not been provided');
  }
  if (contentType == null && payload != null) {
    throw new Error(
      'The content type of request payload (body) has not been provided',
    );
  }
}

function getDate() {
  return new Date().toUTCString();
}

function generateAuthorizationHeader(
  apiKey: string,
  apiSecret: string,
  method: string,
  url: string,
  contentType: string,
  payload: string,
  date: string,
) {
  const httpMethod = method.toLowerCase();
  const dataToSign = createDataToSign(
    httpMethod,
    url,
    contentType,
    payload,
    date,
  );
  const signature = generateHmacBase(dataToSign, apiSecret);

  return getAuthHeader(signature, apiKey, payload);
}

function createDataToSign(method, url, contentType, payload, date) {
  const parsedUrl = new URL(url);
  let dataToSign =
    '(request-target): ' +
    method +
    ' ' +
    parsedUrl.pathname +
    '\nhost: ' +
    parsedUrl.host +
    '\ndate: ' +
    date;
  if (!!payload) {
    dataToSign +=
      '\ncontent-type: ' +
      contentType +
      '\n' +
      'content-length: ' +
      payload.length +
      '\n' +
      payload;
  }

  return dataToSign;
}

function generateHmacBase(dataToSign, apiSecret) {
  return crypto
    .createHmac('sha256', apiSecret)
    .update(dataToSign)
    .digest('base64');
}

function getAuthHeader(signature, apiKey, payload) {
  const headers = !!payload
    ? '(request-target) host date content-type content-length'
    : '(request-target) host date';

  return (
    'Signature keyId="' +
    apiKey +
    '",algorithm="hmac-sha256",headers="' +
    headers +
    '",signature="' +
    signature +
    '"'
  );
}

export function getRefinitivePayload(
  groupId: string,
  name: string,
  gender: string,
  dob: string,
  countryName: string,
): any {
  return {
    groupId: groupId,
    entityType: 'INDIVIDUAL',
    caseId: '',
    providerTypes: ['WATCHLIST'],
    caseScreeningState: {},
    name: name,
    nameTransposition: false,
    secondaryFields: [
      {
        typeId: 'SFCT_1',
        value: gender,
      },
      {
        typeId: 'SFCT_2',
        dateTimeValue: dob,
      },
      {
        typeId: 'SFCT_3',
        value: countryName,
      },
    ],
  };
}
