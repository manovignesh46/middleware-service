export class CreditScoreServiceDto {
  constructor(
    public leadId: string,
    public status: string,
    public message: string,
    public isTelcoKycMatch: boolean,
    public isSanctionStatusMatch: boolean,
  ) {}
}
