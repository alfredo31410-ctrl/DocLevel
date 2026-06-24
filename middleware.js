import { NextResponse } from 'next/server';

export function middleware(request) {
  const basicAuth = request.headers.get('authorization');

  const user = process.env.ADMIN_USER;
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
  matcher: ['/admin/:path*'],
};