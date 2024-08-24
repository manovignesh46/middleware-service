export abstract class IRefinitiveService {
  abstract getSanctionDetails(name: string);
  abstract getRefinitiv(
    name: string,
    gender: string,
    dob: string,
    countryName: string,
  ): Promise<any>;

  abstract refinitiveResolution(
    caseSystemId: string,
    resultIdReferenceId: string,
  ): Promise<any>;
}
