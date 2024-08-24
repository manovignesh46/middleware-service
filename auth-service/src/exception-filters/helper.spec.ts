import { getTimeToUnlockMinutes } from './helper';

describe('getTimeToUnlockMinutes', () => {
  test('should return correct time difference 10m', () => {
    const timeToUnlockMinutes = getTimeToUnlockMinutes(new Date(), 600);
    expect(timeToUnlockMinutes).toEqual(10);
  });
  test('should return correct time difference 1m', () => {
    const timeToUnlockMinutes = getTimeToUnlockMinutes(new Date(), 60);
    expect(timeToUnlockMinutes).toEqual(1);
  });
});
