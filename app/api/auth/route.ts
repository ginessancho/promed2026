import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const AUTH_COOKIE = "promed_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// POST /api/auth - Login
export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const correctPassword = process.env.AUTH_PASSWORD;

    if (!correctPassword) {
      console.error("[Auth] AUTH_PASSWORD not configured");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    if (password === correctPassword) {
      const response = NextResponse.json({ success: true });
      response.cookies.set(AUTH_COOKIE, "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      });
      return response;
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// DELETE /api/auth - Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(AUTH_COOKIE);
  return response;
}

// GET /api/auth - Check auth status
export async function GET() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE);
  
  return NextResponse.json({ 
    authenticated: authCookie?.value === "authenticated" 
  });
}
