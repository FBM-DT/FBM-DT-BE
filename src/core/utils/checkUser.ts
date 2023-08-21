import { UpdateProfileReqDto } from 'src/modules/profile/dto/req';

export const isProfileUpdateAllowedForUserRole = (
  userRole: string,
  data: UpdateProfileReqDto,
): string[] => {
  const forbiddenKeys = [
    'roleId',
    'departmentId',
    'positionId',
    'startDate',
    'endDate',
  ];
  function getNotAllowedFields(key: string[], data): string[] {
    return key.filter((key) => data.hasOwnProperty(key));
  }

  if (userRole === 'user') {
    return getNotAllowedFields(forbiddenKeys, data);
  }
};
