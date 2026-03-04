import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    const isPrivateRoute = privateRoutes.some(route =>
        pathname.startsWith(route)
    );

    if (!accessToken && refreshToken) {
        const data = await checkSession();
        const setCookie = data.headers['set-cookie'];

        if (setCookie) {
            const response = isPublicRoute
                ? NextResponse.redirect(new URL('/', request.url))
                : NextResponse.next();

            const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

            for (const cookieStr of cookieArray) {
                response.headers.append('Set-Cookie', cookieStr);
            }

            return response;
        }
    }

    if (!accessToken) {
        if (isPrivateRoute) {
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }

        return NextResponse.next();
    }

    if (isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/profile/:path*', '/sign-in', '/sign-up'],
};
