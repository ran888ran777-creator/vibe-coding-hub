import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: "Hook placeholder. Replace with Inngest or Trigger.dev handler."
  });
}
