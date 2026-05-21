"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  User,
  LogOut,
  Code2,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { XPBar } from "@/presentation/components/shared/XPBar";
import { StreakBadge } from "@/presentation/components/shared/StreakBadge";
import { createClient } from "@/infrastructure/supabase/client";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/shared/constants";

type SidebarProfile = {
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  total_xp: number | null;
  current_level: number | null;
  current_streak: number | null;
} | null;

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/lecciones", label: "Lecciones", icon: BookOpen },
  { href: "/perfil", label: "Mi perfil", icon: User },
];

export function AppSidebar({ profile }: { profile: SidebarProfile }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex-col lg:border-r lg:border-[var(--color-sidebar-border)] lg:bg-[var(--color-sidebar)]">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-[var(--color-sidebar-border)] px-6">
          <Code2 size={22} className="text-[var(--color-primary)]" />
          <span className="text-lg font-bold tracking-tight">{APP_NAME}</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith(href)
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                  : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              )}
            >
              <Icon size={18} aria-hidden />
              {label}
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div className="border-t border-[var(--color-sidebar-border)] p-4 space-y-3">
          {profile && (
            <>
              <XPBar
                totalXP={profile.total_xp ?? 0}
                level={profile.current_level ?? 1}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium truncate">
                  {profile.display_name ?? profile.username ?? "Usuario"}
                </span>
                <StreakBadge streak={profile.current_streak ?? 0} size="sm" />
              </div>
            </>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-danger)] transition-colors"
          >
            <LogOut size={16} aria-hidden />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-background)] px-4">
        <div className="flex items-center gap-2">
          <Code2 size={20} className="text-[var(--color-primary)]" />
          <span className="font-bold">{APP_NAME}</span>
        </div>
        {profile && (
          <StreakBadge streak={profile.current_streak ?? 0} size="sm" />
        )}
      </header>
    </>
  );
}
