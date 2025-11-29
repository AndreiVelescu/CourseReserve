import { ThrowErrorType } from './server/actions/types';


export function ErrorObject(message: string, field?: string) {
  return { error: [{ message, field }] };
}

export function MultipleErrors(errors: { message: string; field?: string }[]) {
  return { error: errors };
}

export function isStringifiedJson(error: string) {
  try {
    JSON.parse(error);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Parses an error from actions.
 * If the input is a stringified JSON, it extracts the error message.
 * If the input is a regular string, it returns the string as is.
 * @param error - The error to parse.
 * @returns The parsed error message.
 */
export function parseErrorFromActions(error: string) {
  if (isStringifiedJson(error)) {
    const { error: errorMessage }: ThrowErrorType = JSON.parse(error);

    return errorMessage;
  }
  return error;
}
