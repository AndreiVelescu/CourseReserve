import { generateCombinations } from "./array";

export const EmailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// eslint-disable-next-line no-control-regex
export const ASCIILettersOnlyRegex = /^[\x00-\x7F]+$/;

export const createCombinationsRegex = (
  // RegExp string conditions combos
  combos: string[][],
  flags = "g",
): RegExp => {
  const regexString = combos.map((combo) => `(${combo.join("")})`).join("|");
  const regex = new RegExp(regexString, flags);
  return regex;
};

export const lowerCaseRegStr = "(?=.*[a-z])";
export const upperCaseRegStr = "(?=.*[A-Z])";
export const digitRegStr = "(?=.*[0-9])";
export const specialCharRegStr = `(?=.*[-'/\`~!#*$@_%+=.,^&(){}[\\]|;:"<>?\\\\])`;

export const passwordConditions = [
  lowerCaseRegStr,
  upperCaseRegStr,
  digitRegStr,
  specialCharRegStr,
];

// Matches if at least 2 of the password conditions are met
export const PasswordLevel1Regex = createCombinationsRegex(
  generateCombinations(passwordConditions, 2),
);

// Matches if at least 3 of the password conditions are met
export const PasswordLevel2Regex = createCombinationsRegex(
  generateCombinations(passwordConditions, 3),
);
