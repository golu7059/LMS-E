export function isEmail(string) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(string);
}

export function isValidPassword(string) {
    const hasNumber = /[0-9]/.test(string);
    const hasSpecialChar = /[!@#$%^&*]/.test(string);
    const isValidLength = string.length >= 6 && string.length <= 16;
    const isOnlyValidChars = /^[a-zA-Z0-9!@#$%^&*]+$/.test(string);

    return hasNumber && hasSpecialChar && isValidLength && isOnlyValidChars;
}
