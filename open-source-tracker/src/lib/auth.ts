import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

type User={
    id : string;
    email : string;
    name? : string;
    image? : string;
}


export async function getCurrentUser() : Promise< User | null> {
    try {
        const session = await getServerSession(authOptions);
        return session?.user as User || null;    
    } catch (error) {
        console.error('Error Fetching current user : ',error);
        return null;
    }
}

export async function protectRoute() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized User!' },
                { status: 401 }
            )
        }
        return user;    
    } catch (error) {
        console.error('Error in protectRoute : ',error);
        return NextResponse.json(
            {error : 'Internal Server Error !'},
            {status : 500}
        )
    }
}