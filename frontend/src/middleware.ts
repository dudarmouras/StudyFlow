import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req: NextRequest) {
  console.log('🔒 middleware rodando para:', req.nextUrl.pathname)
  const token = req.cookies.get('token')?.value
  console.log('token encontrado:', !!token)
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    await jwtVerify(token, secret)

    return NextResponse.next() 

  } catch {
    const response = NextResponse.redirect(new URL('/', req.url))
    response.cookies.delete('token')
    return response
  }
}

export const config = {
  matcher: ['/roomDecision', '/room/:path*']
}