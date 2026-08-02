export type Role = 'CLIENT' | 'ADMIN' | 'STOCK_MANAGER';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}