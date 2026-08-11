export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MOBILE_REGEX = /^[0-9]{10}$/;

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function isValidMobile(mobile: string): boolean {
  return MOBILE_REGEX.test(mobile.trim());
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function validateRegisterForm(values: {
  fullName: string;
  email: string;
  gender: string;
  mobileNumber: string;
  address: string;
  city: string;
  password: string;
  confirmPassword: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!isNonEmpty(values.fullName)) errors.fullName = 'Full name is required.';
  if (!isNonEmpty(values.email)) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!isNonEmpty(values.gender)) errors.gender = 'Please select a gender.';
  if (!isNonEmpty(values.mobileNumber)) {
    errors.mobileNumber = 'Mobile number is required.';
  } else if (!isValidMobile(values.mobileNumber)) {
    errors.mobileNumber = 'Mobile number must be exactly 10 digits.';
  }
  if (!isNonEmpty(values.address)) errors.address = 'Address is required.';
  if (!isNonEmpty(values.city)) errors.city = 'Please select a city.';
  if (!isNonEmpty(values.password)) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }
  if (!isNonEmpty(values.confirmPassword)) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateLoginForm(values: { email: string; password: string }): ValidationResult {
  const errors: Record<string, string> = {};
  if (!isNonEmpty(values.email)) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!isNonEmpty(values.password)) errors.password = 'Password is required.';
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateProfileForm(values: {
  fullName: string;
  mobileNumber: string;
  address: string;
  city: string;
}): ValidationResult {
  const errors: Record<string, string> = {};
  if (!isNonEmpty(values.fullName)) errors.fullName = 'Full name is required.';
  if (!isValidMobile(values.mobileNumber)) errors.mobileNumber = 'Mobile number must be exactly 10 digits.';
  if (!isNonEmpty(values.address)) errors.address = 'Address is required.';
  if (!isNonEmpty(values.city)) errors.city = 'Please select a city.';
  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Very small, dependency-free string hash used to avoid storing plain-text
 * passwords in AsyncStorage. This is NOT cryptographically secure and
 * should never be used for a production authentication system - a real
 * backend with bcrypt/argon2 should own password hashing. It only exists
 * here because this assignment has no backend.
 */
export function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return `h${Math.abs(hash)}_${input.length}`;
}
