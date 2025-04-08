import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
// console.log(prisma);



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
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Email and password are required.");
                    }
            
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });
            
                    if (!user) {
                        throw new Error("No user found with this email.");
                    }
            
                    if (!user.password) {
                        throw new Error("User does not have a password set.");
                    }
            
                    const isValid = await bcrypt.compare(credentials.password, user.password);
            
                    if (!isValid) {
                        throw new Error("Invalid password.");
                    }
            
                    return user;
                } catch (error) {
                    console.error("Error in authorize function:", error.message);
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