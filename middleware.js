 import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const publicRoutes = [
    '/login',
    '/forgetPassword',
    '/verifyResetCode',
    '/resetPassword',
    '/register'
  ];

  const adminRoutes = ['/users', '/session', '/evaluation'];
  const superAdminOnlyRoutes = ['/plans/add'];


  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  const userDataRaw = request.cookies.get('user')?.value;

  let user = null;
  if (userDataRaw) {
    try {
      user = JSON.parse(decodeURIComponent(userDataRaw));
    } catch (error) {
      console.error('Error parsing user cookie:', error);
    }
  }

  
  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }


  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }


  if (user && user.role === 'admin' && user.subscriptions !== true) {
  
     const allowedForUnsubscribed = ['/plans', '/']; 
     
     if (!allowedForUnsubscribed.includes(pathname)) {
        return NextResponse.redirect(new URL('/plans', request.url));
     }
  }

  
  if (user?.role === 'super-admin') {
    return NextResponse.next();
  }

  
  if (superAdminOnlyRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/', request.url));
  }


  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}