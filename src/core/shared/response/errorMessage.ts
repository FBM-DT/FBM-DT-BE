export const errorMessageRes = {
  cannotFindById(id: string, resource: string): string {
    return `Cannot find ${resource} with id: ${id}`;
  },
};
