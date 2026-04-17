import { NextResponse } from "next/server";
import { z } from "zod";
import { buildSessionCookieValue, getSessionCookieName, getSessionCookieOptions, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());
    const user = await db.user.findUnique({
      where: { email: body.email.toLowerCase() }
    });

    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

    response.cookies.set(getSessionCookieName(), buildSessionCookieValue(user), getSessionCookieOptions());
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to sign in." },
      { status: 400 }
    );
  }
}
