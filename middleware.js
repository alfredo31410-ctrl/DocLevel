import { NextResponse } from 'next/server';

function splitCredentials(decoded) {
  const separatorIndex = decoded.indexOf(':');

  if (separatorIndex === -1) {
    return ['', ''];
  }

  return [decoded.slice(0, separatorIndex), decoded.slice(separatorIndex + 1)];
}

function decodeBasicAuth(value) {
  const encoded = value.split(' ')[1];
  const bytes = Uint8Array.from(atob(encoded), (char) => char.charCodeAt(0));
  const decodedValues = [];

  try {
    decodedValues.push(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch (error) {
    // Some browsers or password managers can still submit Basic Auth as Latin-1.
  }

  decodedValues.push(new TextDecoder('iso-8859-1').decode(bytes));

  return [...new Set(decodedValues)].map(splitCredentials);
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

  const user = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD?.trim();
  const basicAuth = request.headers.get('authorization');

  if (basicAuth?.startsWith('Basic ') && user && password) {
    try {
      const credentials = decodeBasicAuth(basicAuth);
      const isAuthorized = credentials.some(([inputUser, inputPassword]) => {
        return inputUser.toLowerCase().trim() === user && inputPassword.trim() === password;
      });

      if (isAuthorized) {
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