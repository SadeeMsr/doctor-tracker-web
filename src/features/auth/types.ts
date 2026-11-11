/** Mirrors the API's `presentUser` exactly. */
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  createdAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
