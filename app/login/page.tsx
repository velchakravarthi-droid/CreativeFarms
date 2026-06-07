import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="login-shell">
      <section className="login-panel">
        <div className="brand login-brand">
          <div className="brand-mark">CF</div>
          <div>
            <strong>Creative Farm</strong>
            <span>Admin login</span>
          </div>
        </div>
        <h1>Sign in</h1>
        <p>Use your Supabase email and password to access farm operations.</p>
        <LoginForm />
      </section>
    </main>
  );
}
