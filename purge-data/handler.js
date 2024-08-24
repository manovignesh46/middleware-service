'use strict';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import * as pg from 'pg';

//ready from .env
dotenv.config();

//table definitions
const TABLES = {
  CUST_OTP: 'cust_otp'
}

const DELETE_STATUS = 'LEAD_ONBOARDED';

export const purgeData = async (event, context, callback) => {
  const client = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: 5432
  });
  await client.connect();
  //Query to clean the data based on buiseness logic
  const dateNow = new Date();
  const dateNowInTime = dateNow.getTime();
  const timeDiff = (1000 * 3600 * 24 * 90); //90 days calculation in ms
  const date90DaysBeforeInTime = dateNowInTime - timeDiff;
  const date90DaysBefore = new Date(date90DaysBeforeInTime);

  const res = await client.query(`DELETE FROM ${TABLES.CUST_OTP} WHERE updatedAt < ? AND lead_current_status != ?`, [date90DaysBefore, DELETE_STATUS]);
  console.log(`Total Deleted rows are : ${res.rows.length}`);
  console.log(JSON.stringify(res));
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: 'Data purged successfully!!',
      input: event,
      output: res
    }),
  };
  await client.end();
  callback(null, response);
};
