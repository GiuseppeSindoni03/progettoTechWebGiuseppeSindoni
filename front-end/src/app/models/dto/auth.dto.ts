export interface AuthResponse {
    token: string;
    userResponse: {
      id: string;
      email: string;
      username: string;
    };
  }
  