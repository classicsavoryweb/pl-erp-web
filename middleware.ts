import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('authToken');
    const permissions = request.cookies.get('permissions')
    const { pathname } = request.nextUrl;
    
    if (pathname !== "/login" && !authToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname === "/login" && authToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
};

export const config = {
    matcher: ['/((?!_next|api|favicon.ico|images).*)'],
};