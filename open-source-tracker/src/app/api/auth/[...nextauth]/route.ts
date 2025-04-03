import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';

export const authOptions:NextAuthOptions = {
    adapter : PrismaAdapter(prisma),
    providers : [
        GitHub({
            clientId : process.env.GITHUB_CLIENT_ID as string,
            clientSecret : process.env.GITHUB_CLIENT_SECRET as string
        }),
        Credentials({
            name: 'Credentials',
            credentials: {
              email: { label: "Email", type: "email" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) return null;
            
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });
            
                    if (!user?.password) return null;
            
                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
            
                    return isValid ? user : null;
                } catch (error) {
                    console.error("Error in authorize function:", error);
                    return null;
                }
            }
        })
    ],
    session: {strategy : 'jwt'},
    secret : process.env.NEXTAUTH_SECRET,
    callbacks : {
        async jwt({token,user}) {
            if(user) {
                token.id = user.id;   
            }
            return token;
        },
        async session({session,token}) {
            session.id = token.id as string;
            return session;
        }
    }
}

const handler = NextAuth(authOptions);
export {handler as GET,handler as POST};