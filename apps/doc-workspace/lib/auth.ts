import { db } from "@/lib/db";

const DEV_EMAIL = "founder@docworkspace.local";

export async function getCurrentUser() {
  return db.user.upsert({
    where: { email: DEV_EMAIL },
    update: {},
    create: {
      email: DEV_EMAIL,
      name: "Founding User"
    }
  });
}
