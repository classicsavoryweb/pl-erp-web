import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PAGE_PERMISSION } from './constants/page-permissions';
import { toast } from "react-toastify";

function convertToRegex(pathname: string): RegExp {
    const pattern = "^" + pathname
        .replace(/\[.*?\]/g, "[^/]+")
        .replace(/\//g, "\\/") + "$";
    return new RegExp(pattern);
}

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('authToken');
    const { pathname } = request.nextUrl;

    const permissions: string[] = [];
    let index = 0;
    while (true) {
        const cookie = request.cookies.get(`permissions_${index}`);
        if (!cookie) break;

        permissions.push(...JSON.parse(cookie.value));
        
        index++;
    }

    if (pathname !== "/login" && !authToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname === "/login" && authToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    const permissionNeeded = PAGE_PERMISSION.find((page) => {
        const regex = convertToRegex(page.pathname);
        return regex.test(pathname);
    });

    if (
        permissionNeeded?.permission &&
        authToken &&
        !permissions.includes(permissionNeeded.permission)
    ) {
        return NextResponse.redirect(new URL('/no-access', request.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: ['/((?!_next|api|favicon.ico|images).*)'],
};