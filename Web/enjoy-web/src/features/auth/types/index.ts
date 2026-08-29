export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username?: string;
  email: string;
  password: string;
  birthday?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface User {
  id?: string | number;
  email: string;
  username?: string;
}
