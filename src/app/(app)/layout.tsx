import { redirect } from "next/navigation";
import { createClient } from "@/infrastructure/supabase/server";
import { AppSidebar } from "@/presentation/components/layout/AppSidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, avatar_url, total_xp, current_level, current_streak")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-dvh bg-[var(--color-background)]">
      <AppSidebar profile={profile} />
      <main className="flex-1 min-w-0 lg:pl-64">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
