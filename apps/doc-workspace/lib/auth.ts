import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { env } from "@/lib/env";

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE_NAME = "dw_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;

type SessionPayload = {
  userId: string;
  email: string;
  exp: number;
};

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

function sign(value: string) {
  return createHmac("sha256", env.NEXTAUTH_SECRET).update(value).digest("base64url");
}

function encodePayload(payload: SessionPayload) {
  const serialized = JSON.stringify(payload);
  const encoded = Buffer.from(serialized).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

function decodePayload(token: string) {
  const [encoded, signature] = token.split(".");

  if (!encoded || !signature) {
    return null;
  }

  const expected = sign(encoded);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
  if (payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, passwordHash: string | null) {
  if (!passwordHash) {
    return false;
  }

  const [salt, storedHash] = passwordHash.split(":");
  if (!salt || !storedHash) {
    return false;
  }

  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const stored = Buffer.from(storedHash, "hex");

  return stored.length === derived.length && timingSafeEqual(stored, derived);
}

export function buildSessionCookieValue(user: { id: string; email: string }) {
  return encodePayload({
    userId: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  });
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: false,
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  };
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

async function getSessionPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return decodePayload(token);
}

export async function getCurrentUser() {
  const session = await getSessionPayload();
  if (!session) {
    return null;
  }

  return db.user.findUnique({
    where: { id: session.userId }
  });
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
}
