export class TelcoTransactionResp {
  id: number;
  countrycode: number;
  msisdn: number;
  wallet_risk_score: number;
  loan_risk_score: number;
  churn_decile: number;
  spend_quartile: number;
  of_last_30d: number;
}
