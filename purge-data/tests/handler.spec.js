// import * as pg from 'pg';
jest.mock('pg', () => {
    const mClient = {
        connect: jest.fn(),
        query: () => {
            return {
                rows: [{ id: '1' }, { id: '2' }]
            }
        },
        end: jest.fn(),
    };
    return { Client: jest.fn(() => mClient) };
});

import { purgeData } from '../handler';

describe('Purge Data Testing', () => {
    it('Test the success of prging data', async () => {
        const expectedResp = { "body": "{\"message\":\"Data purged successfully!!\",\"input\":null,\"output\":{\"rows\":[{\"id\":\"1\"},{\"id\":\"2\"}]}}", "headers": { "Access-Control-Allow-Origin": "*" }, "statusCode": 200 }
        function callback(error, data) {
            if (error) {
                throw error;
            }
            expect(data.statusCode).toBe(200);
            expect(data.body).toBe(expectedResp.body);
        }
        purgeData(null, null, callback)

        expect(true).toEqual(true);
    });
});