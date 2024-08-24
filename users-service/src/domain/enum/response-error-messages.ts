export enum ResponseErrorMessages {
  GENERIC_CONNECTION_ERROR = 'Error Connecting to Endpoint',
  INVALID_HTTP_CODE = 'Invalid HTTP Status Response Code. Internal Request Failed',
  INVALID_RESPONSE_BODY = 'Invalid Response Body',
  ERROR_PARSING_XML_RESPONSE_BODY = 'Error when Parsing XML Response Body',
  RESPONSE_TIMEOUT = 'Timeout when Connecting to Endpoint',
}
