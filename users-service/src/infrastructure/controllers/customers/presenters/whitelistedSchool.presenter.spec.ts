import {
  WhitelistedSchoolLabel,
  WhitelistedSchoolPresenter,
} from './whitelistedSchool.presenter';

export const generateMockWhitelistedSchoolPresenter = () => {
  const dto: WhitelistedSchoolPresenter = new WhitelistedSchoolPresenter();
  const school: WhitelistedSchoolLabel = new WhitelistedSchoolLabel();
  school.label = 'OTHER';
  school.value = 'OTHER';

  const school1: WhitelistedSchoolLabel = new WhitelistedSchoolLabel();
  school1.label = 'schoolName';
  school1.value = 'schoolName';
  dto.whitelistedSchools = [school, school1];
  return dto;
};
it('should pass is it has all the property', async () => {
  const presenter: WhitelistedSchoolPresenter =
    generateMockWhitelistedSchoolPresenter();
  expect(presenter).toHaveProperty('whitelistedSchools');
});
