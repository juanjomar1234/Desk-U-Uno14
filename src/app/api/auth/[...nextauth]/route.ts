import NextAuth, { NextAuthOptions, DefaultUser } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'

// Extender DefaultUser en lugar de User
declare module "next-auth" {
  interface Session {
    user: DefaultUser & {
      id: string
      role: string | null
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          console.log('User not found:', credentials.email)
          return null
        }

        const isValid = await compare(credentials.password, user.password)

        if (!isValid) {
          console.log('Invalid password for user:', credentials.email)
          return null
        }

        return {
          id: user.id,
          name: user.name || '',  // Asegurar que no es null
          email: user.email,
          image: user.image || undefined,  // NextAuth espera undefined, no null
          role: user.role || 'user'  // Valor por defecto si es null
        }
      }
    })
  ],
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
        role: token.role
      }
    })
  },
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  debug: process.env.NODE_ENV === 'development'
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
