import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const publicRoutes = [
    '/login',
    '/forgetPassword',
  ];

  
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;


  if (
    token &&
    (pathname === '/login' ||
      pathname === '/forgetPassword' ||
      pathname === '/verifyResetCode' ||
      pathname === '/resetPassword')
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }


  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
