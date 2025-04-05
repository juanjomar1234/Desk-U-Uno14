import NextAuth, { DefaultSession, JWT as NextAuthJWT } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
  }

  interface JWT extends NextAuthJWT {
    id: string;
    role: string;
  }
}

export {}; 