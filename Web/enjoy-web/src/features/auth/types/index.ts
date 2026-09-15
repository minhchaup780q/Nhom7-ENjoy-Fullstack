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

export interface User {
  id?: string | number;
  email: string;
  username?: string;
  role?: string;
  hasPassword?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  hasPassword?: boolean;
  user?: User;
  // Giữ lại các trường tùy chọn phòng trường hợp legacy
  email?: string;
  role?: string;
  requiresBirthday?: boolean;
}
