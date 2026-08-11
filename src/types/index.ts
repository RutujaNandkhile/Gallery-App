export type Gender = 'Male' | 'Female' | 'Other';

export interface RegisteredUser {
  id: string;
  fullName: string;
  email: string;
  gender: Gender;
  mobileNumber: string;
  address: string;
  city: string;
  // NOTE: for a real backend this would never be stored in plain text.
  // Since this app has no server, we hash it locally before persisting.
  passwordHash: string;
  avatarId?: string;
}

export type PublicUser = Omit<RegisteredUser, 'passwordHash'>;

export interface RegisterFormValues {
  fullName: string;
  email: string;
  gender: Gender;
  mobileNumber: string;
  address: string;
  city: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface ProfileUpdateValues {
  fullName: string;
  mobileNumber: string;
  address: string;
  city: string;
  gender: Gender;
  avatarId?: string;
}

// Shape returned by https://picsum.photos/v2/list
export interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export type FilterOption = 'all' | 'a-m' | 'n-z';

export const CITIES = [
  'Mumbai',
  'Pune',
  'Delhi',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Nagpur',
];

export const AVATARS = ['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6'];
