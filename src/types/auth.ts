export interface User {
  id: string;
  teamName: string;
  email: string;
  teamCode?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
