import { NextResponse } from 'next/server'

export async function GET() {
    const response = NextResponse.redirect(new URL('/auth/login', process.env.NEXT_PUBLIC_BASE_URL))

    // Hapus cookie token
    response.cookies.set('token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
    })

    return response
}