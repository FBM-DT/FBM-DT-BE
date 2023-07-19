export const ErrorHandler = {
  invalid(message: string) {
    throw new Error(`${message} is invalid`);
  },

  alreadyExists(message: string) {
    throw new Error(`${message} already exists`);
  },

  notFound(message: string) {
    throw new Error(`${message} does not exist`);
  },
};
