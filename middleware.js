import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const isPrefetch =
    request.headers.get('next-router-prefetch') === '1' ||
    request.headers.get('purpose') === 'prefetch' ||
    request.headers.get('sec-purpose') === 'prefetch';

  if (isPrefetch) {
    return new NextResponse(null, { status: 204 });
  }

const basicAuth = request.headers.get('authorization');
const user = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [inputUser, inputPassword] = atob(authValue).split(':');

    if (inputUser === user && inputPassword === password) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Acceso restringido', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin DocLevel"',
    },
  });
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};