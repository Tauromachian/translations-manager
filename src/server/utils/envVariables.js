/**
 * Search for the env variable provided as an argument. If the variable doesn't exist it throws an error.
 * @param {string[]} environmentVariables - The array of environment variables names.
 * @throws {Error} - If the env variable doesn't exist.
 */
export function enforceEnvironmentVariables(environmentVariables) {
  for (const variable of environmentVariables) {
    if (!Deno.env.get(variable)) {
      const errMessage = `The ${variable} environment variable is required`;
      console.error(errMessage);
      throw new Error(errMessage);
    }
  }
}
