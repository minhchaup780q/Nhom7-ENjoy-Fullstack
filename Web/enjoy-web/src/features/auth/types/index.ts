export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  birthday: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface ResendOtpData {
  email: string;
}

export interface ChangePasswordData {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  email?: string;
  role?: string;
  hasPassword?: boolean;
  requiresBirthday?: boolean;
}

export interface User {
  id?: string | number;
  email: string;
  username?: string;
  role?: string;
  hasPassword?: boolean;
}
