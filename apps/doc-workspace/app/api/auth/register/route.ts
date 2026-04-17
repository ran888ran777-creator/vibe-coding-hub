import { NextResponse } from "next/server";
import { z } from "zod";
import { buildSessionCookieValue, getSessionCookieName, getSessionCookieOptions, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";

const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(256)
});

export async function POST(request: Request) {
  try {
    const body = registerSchema.parse(await request.json());
    const existing = await db.user.findUnique({
      where: { email: body.email.toLowerCase() }
    });

    if (existing) {
      return NextResponse.json({ error: "Email is already registered." }, { status: 409 });
    }

    const user = await db.user.create({
      data: {
        name: body.name,
        email: body.email.toLowerCase(),
        passwordHash: await hashPassword(body.password)
      }
    });

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
      { error: error instanceof Error ? error.message : "Unable to register." },
      { status: 400 }
    );
  }
}
