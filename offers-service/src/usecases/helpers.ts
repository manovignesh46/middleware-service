import moment from 'moment';

export function getTimestamp() {
  this.logger.log(this.getTimestamp.name);
  return moment().utc().format('YYYYMMDDHHmmss').toString();
}
