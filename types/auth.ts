export type AuthResponse = {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
};
