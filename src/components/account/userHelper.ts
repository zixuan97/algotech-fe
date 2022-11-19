import { User, UserRole } from 'src/models/types';

export const isValidUser = (userToValidate: Partial<User> | null): boolean => {
  if (!userToValidate) return false;
  if (userToValidate.role === UserRole.B2B) {
    return !!(
      userToValidate.email &&
      userToValidate.lastName &&
      userToValidate.firstName &&
      userToValidate.role
    );
  }
  return !!(
    userToValidate.email &&
    userToValidate.lastName &&
    userToValidate.firstName &&
    userToValidate.role &&
    userToValidate.tier
  );
};
