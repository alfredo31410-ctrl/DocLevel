import { NextResponse } from 'next/server';

function decodeBasicAuth(value) {
  const encoded = value.split(' ')[1];
  const bytes = Uint8Array.from(atob(encoded), (char) => char.charCodeAt(0));
  const decoded = new TextDecoder().decode(bytes);
  const separatorIndex = decoded.indexOf(':');

  if (separatorIndex === -1) {
    return ['', ''];
  }

  return [decoded.slice(0, separatorIndex), decoded.slice(separatorIndex + 1)];
}

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

  const user = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!user || !password) {
    return NextResponse.next();
  }

  const basicAuth = request.headers.get('authorization');

  if (basicAuth?.startsWith('Basic ')) {
    try {
      const [inputUser, inputPassword] = decodeBasicAuth(basicAuth);

      if (inputUser.trim() === user && inputPassword.trim() === password) {
        return NextResponse.next();
      }
    } catch (error) {
      // Fall through to the browser login prompt.
    }
  }

  return new NextResponse(null, {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="DocLevel Admin", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};