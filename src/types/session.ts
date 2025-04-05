// Definir tipos para la sesión
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

export interface Session {
  user: User;
} 