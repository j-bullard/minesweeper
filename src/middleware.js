export function middleware(request) {
  const token = request.cookies.get('token')?.value

  // Redirect to login if no user is logged in
  if (!token && !['/login', '/signup'].includes(request.nextUrl.pathname)) {
    return Response.redirect(new URL('/login', request.url))
  }

  // Redirect to home if user is logged in
  if (token && ['/login', '/signup'].includes(request.nextUrl.pathname)) {
    return Response.redirect(new URL('/', request.url))
  }
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
