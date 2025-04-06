import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import logger from "@/lib/logger";
import { User } from "@/types/session";
import { API_ENDPOINTS, getApiUrl } from '@/lib/api';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          logger.warn("Intento de inicio de sesión sin credenciales completas");
          return null;
        }

        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!dbUser) {
            logger.warn("Usuario no encontrado");
            return null;
          }

          const user: User = {
            id: dbUser.id,
            name: dbUser.name || '',
            email: dbUser.email,
            image: dbUser.image || undefined,
            role: dbUser.role || 'user'
          };

          return user;
        } catch (error) {
          logger.error("Error en autenticación", error);
          return null;
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string
        }
      };
    }
  }
};

// Usar getApiUrl con el endpoint correcto
const loginUrl = getApiUrl(API_ENDPOINTS.auth.login);
