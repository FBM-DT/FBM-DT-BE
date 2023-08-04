import * as bcrypt from 'bcrypt';

export const Bcrypt = {
  handleHashPassword(password: string) {
    const saltOrRounds = 10;
    const hashPassword = bcrypt.hashSync(password, saltOrRounds);
    return hashPassword;
  },

  isPasswordValid(password: string): boolean {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialRegex = /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/;

    const hasUppercase = uppercaseRegex.test(password);
    const hasLowercase = lowercaseRegex.test(password);
    const hasNumber = numberRegex.test(password);
    const hasSpecialChar = specialRegex.test(password);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      return false;
    } else if (hasUppercase && hasLowercase && hasNumber && hasSpecialChar) {
      return true;
    }
  },
};
