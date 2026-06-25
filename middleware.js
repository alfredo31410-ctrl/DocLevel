import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const isPrefetch =
    request.method === 'HEAD' ||
    request.headers.get('next-router-prefetch') === '1' ||
    request.headers.get('purpose') === 'prefetch' ||
    request.headers.get('sec-purpose') === 'prefetch';

  if (isPrefetch) {
    return new NextResponse(null, { status: 204 });
  }

  const basicAuth = request.headers.get('authorization');
  const user = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (basicAuth?.startsWith('Basic ')) {
    try {
      const authValue = basicAuth.split(' ')[1];
      const [inputUser, inputPassword] = atob(authValue).split(':');

      if (inputUser === user && inputPassword === password) {
        return NextResponse.next();
      }
    } catch (error) {
      // Fall through to the browser login prompt.
    }
  }

  return new NextResponse(null, {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="DocLevel Admin"',
    },
  });
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};