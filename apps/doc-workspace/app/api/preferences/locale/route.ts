import { NextResponse } from "next/server";
import { normalizeLocale } from "@/lib/i18n";

export async function POST(request: Request) {
  const body = (await request.json()) as { locale?: string };
  const locale = normalizeLocale(body.locale);
  const response = NextResponse.json({ locale });

  response.cookies.set("dw_locale", locale, {
    httpOnly: false,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 365
  });

  return response;
}
