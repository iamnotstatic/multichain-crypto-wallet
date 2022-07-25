export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const extractError = (error: any): string => {
  if (error && typeof error === 'object') {
    if (error.response) {
      return extractError(error.response);
    }
    if (error.error) {
      return extractError(error.error);
    }
    if (error.message) {
      return extractError(error.message);
    }
    if (error.data) {
      return extractError(error.data);
    }
    if (error.context) {
      return extractError(error.context);
    }
    if (error.statusText) {
      return extractError(error.statusText);
    }
    try {
      return JSON.stringify(error);
    } catch (error) {
      // Ignore JSON error
    }
  }
  // Remove `Error: ` prefix.
  try {
    if (typeof error === 'string') {
      if (error.slice(0, 7).toLowerCase() === 'Error: ') {
        // tslint:disable-next-line: no-parameter-reassignment
        error = error.slice(7);
      }
      return error;
    }
    return JSON.stringify(error);
  } catch (error) {
    // Ignore JSON error
  }
  return String(error);
};

// export const onlyMainnet = <T>(x: any, testnet: boolean) =>
//     testnet ? undefined : x;
// export const onlyTestnet = <T>(x: any, testnet: boolean) =>
//     testnet ? x : undefined;

export const fallback = async <T>(
  fallbacks: Array<undefined | (() => Promise<T>)>
): Promise<T> => {
  let firstError: Error | undefined;
  for (const fn of fallbacks) {
    if (!fn) {
      continue;
    }
    try {
      return await fn();
    } catch (error) {
      firstError = firstError || (error as Error);
    }
  }
  throw firstError || new Error('No result returned');
};

export const retryNTimes = async <T>(
  fnCall: () => Promise<T>,
  retries: number
) => {
  let returnError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fnCall();
    } catch (error) {
      if (String(error).match(/timeout of .* exceeded/)) {
        returnError = error;
      } else {
        const errorMessage = extractError(error);
        if (errorMessage) {
          // tslint:disable-next-line: no-object-mutation
          error.message += ` (${errorMessage})`;
        }
        throw error;
      }
    }
    await sleep(500);
  }
  throw returnError;
};
