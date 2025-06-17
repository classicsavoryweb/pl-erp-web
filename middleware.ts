import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PAGE_PERMISSION } from './constants/page-permissions';

function convertToRegex(pathname: string): RegExp {
    const pattern = "^" + pathname
        .replace(/\[.*?\]/g, "[^/]+")
        .replace(/\//g, "\\/") + "$";
    return new RegExp(pattern);
}

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('authToken');
    const permissions = request.cookies.get('permissions')
    const { pathname } = request.nextUrl;
    const parsedPermissions = permissions ? JSON.parse(permissions.value) : null;

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

    if (authToken && permissionNeeded && !parsedPermissions.includes(permissionNeeded.permission)) {
        return NextResponse.redirect(new URL('/no-access', request.url));
    }

    return NextResponse.next();
};

export const config = {
    matcher: ['/((?!_next|api|favicon.ico|images).*)'],
};