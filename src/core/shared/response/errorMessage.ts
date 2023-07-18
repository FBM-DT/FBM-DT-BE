export const errorMessageRes = {
  cannotFindById(id: string | number, resource: string): string {
    return `Cannot find ${resource} with id: ${id}`;
  },
};
