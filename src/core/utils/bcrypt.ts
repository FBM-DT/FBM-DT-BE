import * as bcrypt from 'bcrypt';

export const Bcrypt = {
  handleHashPassword(password: string) {
    const saltOrRounds = 10;
    const hashPassword = bcrypt.hashSync(password, saltOrRounds);
    return hashPassword;
  },

  isPasswordValid(password: string): boolean {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{}|;:,.<>?]).{8,}$/;
    return passwordRegex.test(password);
  },
};
