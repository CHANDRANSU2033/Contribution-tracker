import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

const protectRoutes = ['/dashboard','/api/contributions'];

export async function middleware(request:NextRequest) : Promise<NextResponse> {
    const path = request.nextUrl.pathname;
    const isProtected = protectRoutes.some(route =>path===route|| path.startsWith(`${route}/`));

    if(!isProtected) return NextResponse.next();

    const token = await getToken({req : request,secret : process.env.NEXTAUTH_SECRET});

    if(!token) {
        const signUrl = new URL('/signin',request.url);
        return NextResponse.redirect(signUrl);
    }

    return NextResponse.next();
    
}