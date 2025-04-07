import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

type SignupRequestBody = {
    email : string;
    password : string;
    name? : string;
}

export async function POST(request : Request) {
    
    try {
        const body = await request.json();
        
        if (!body.email || !body.password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 }
            );
        }
        const {email,password,name} : SignupRequestBody = body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format." },
                { status: 400 }
            );
        }
        
        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters long." },
                { status: 400 }
            );
        }   

        const existingUser = await prisma.user.findUnique(
            { where : {email}}
        )

        if(existingUser) {
            return NextResponse.json(
                {error : 'User already exist'},
                {status : 409}
            )
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await prisma.user.create({
            data : {
                email,
                password : hashedPassword,
                name
            }
        })
        const { id,email:userEmail,name:userName} = user;
        return NextResponse.json(
            {user : {id,email : userEmail,name : userName }},
            {status : 201}
        )
    } catch (error) {
        console.error("Error during user signup : ",error)
        return NextResponse.json(
            {error : `Internal server Error`},
            {status : 500}
        )
    }
}
