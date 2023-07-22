export const ErrorHandler = {
  invalid(message: string) {
    return `${message} is invalid`;
  },

  alreadyExists(message: string) {
    return `${message} already exists`;
  },

  notFound(message: string) {
    return `${message} does not exist`;
  },
};
