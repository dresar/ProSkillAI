"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  DownloadCloud,
  FileCode,
  Tag,
  Users,
  Settings,
  History,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  userRole: string;
}

export function AdminSidebar({ userRole }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const links = [
    { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
    { href: "/admin/skills", label: "Skills", icon: Layers },
    ...(userRole === "admin"
      ? [{ href: "/admin/github-import", label: "Impor GitHub", icon: DownloadCloud }]
      : []),
    { href: "/admin/prompts", label: "Prompts", icon: FileCode },
    { href: "/admin/categories", label: "Kategori", icon: Tag },
    ...(userRole === "admin"
      ? [
          { href: "/admin/users", label: "Pengguna", icon: Users },
          { href: "/admin/settings", label: "Pengaturan", icon: Settings },
        ]
      : []),
    { href: "/admin/activity", label: "Log Aktivitas", icon: History },
  ];

  const toggleCollapse = () => setCollapsed((prev) => !prev);

  return (
    <>
      <div className="lg:hidden p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-surface">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-foreground shrink-0" width="20" height="20" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="4" width="6" height="24" rx="2" fill="currentColor" />
            <rect x="12" y="4" width="14" height="6" rx="2" fill="currentColor" />
            <rect x="20" y="8" width="6" height="9" rx="2" fill="currentColor" />
            <rect x="12" y="15" width="14" height="6" rx="2" fill="currentColor" />
          </svg>
          <span className="font-semibold text-sm">ProSkillAI Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1 rounded border border-neutral-300 dark:border-neutral-700"
          aria-label="Buka menu admin"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex">
          <div className="w-64 bg-surface h-full border-r border-neutral-200 dark:border-neutral-800 p-4 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <span className="font-semibold text-sm">Menu Admin</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1 text-neutral-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="mt-4 space-y-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-foreground text-background"
                          : "text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <aside
        className={`hidden lg:flex flex-col justify-between border-r border-neutral-200 dark:border-neutral-800 bg-surface transition-all duration-200 ${
          collapsed ? "w-16" : "w-56"
        } min-h-screen`}
      >
        <div>
          <div className="h-14 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-3.5">
            <Link href="/admin" className="flex items-center gap-2.5 overflow-hidden">
              <svg className="w-6 h-6 shrink-0 text-foreground" width="24" height="24" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="4" width="6" height="24" rx="2" fill="currentColor" />
                <rect x="12" y="4" width="14" height="6" rx="2" fill="currentColor" />
                <rect x="20" y="8" width="6" height="9" rx="2" fill="currentColor" />
                <rect x="12" y="15" width="14" height="6" rx="2" fill="currentColor" />
              </svg>
              {!collapsed && (
                <span className="font-semibold text-xs tracking-tight truncate">
                  ProSkillAI
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={toggleCollapse}
              className="p-1 rounded text-neutral-500 hover:text-foreground cursor-pointer"
              aria-label={collapsed ? "Buka sidebar" : "Ciutkan sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          <nav className="p-2 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={collapsed ? link.label : undefined}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-foreground text-background"
                      : "text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{link.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500">
          {!collapsed && (
            <div className="truncate">
              Role: <span className="font-semibold text-foreground">{userRole}</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
