import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { getCurrentUser } from "@/lib/auth";
import { getCurrentLocale } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();
  const locale = await getCurrentLocale();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="auth-shell">
      <AuthForm locale={locale} mode="login" />
    </main>
  );
}
