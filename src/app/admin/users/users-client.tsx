"use client";

import * as React from "react";
import { useActionState } from "react";
import { createUserAction, updateUserRoleAction } from "./actions";
import { UserPlus, AlertCircle, Shield, User } from "lucide-react";
import type { User as UserType } from "@/db/schema";

export function UsersClient({ usersList }: { usersList: UserType[] }) {
  const [state, formAction, isPending] = useActionState(createUserAction, null);
  const [openNew, setOpenNew] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Manajemen Pengguna (Admin & Editor)
          </h2>
          <p className="text-xs text-neutral-500">
            Hanya administrator yang memiliki akses ke halaman ini. Pendaftaran publik dinonaktifkan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpenNew(!openNew)}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-95 cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Tambah Staf</span>
        </button>
      </div>

      {openNew && (
        <form
          action={formAction}
          className="p-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface space-y-4 text-xs animate-in fade-in"
        >
          <h3 className="font-semibold text-foreground">Tambah Akun Staf Baru</h3>

          {state?.error && (
            <div className="p-2.5 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-foreground flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="user-name" className="block font-medium text-foreground">
                Nama Lengkap *
              </label>
              <input
                id="user-name"
                name="name"
                type="text"
                required
                className="w-full h-8 px-2.5 rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="user-email" className="block font-medium text-foreground">
                Email *
              </label>
              <input
                id="user-email"
                name="email"
                type="email"
                required
                className="w-full h-8 px-2.5 rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="user-password" className="block font-medium text-foreground">
                Password Sementara * (min 8 karakter)
              </label>
              <input
                id="user-password"
                name="password"
                type="password"
                required
                minLength={8}
                className="w-full h-8 px-2.5 rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="user-role" className="block font-medium text-foreground">
                Peran (Role)
              </label>
              <select
                id="user-role"
                name="role"
                defaultValue="user"
                className="w-full h-8 px-2 rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
              >
                <option value="user">User (Staf Standar)</option>
                <option value="editor">Editor (Kelola Skill & Prompt)</option>
                <option value="admin">Admin (Akses Penuh)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOpenNew(false)}
              className="h-8 px-3 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="h-8 px-4 rounded bg-foreground text-background font-medium hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? "Menyimpan..." : "Simpan Pengguna"}
            </button>
          </div>
        </form>
      )}

      <div className="rounded-md border border-border bg-surface overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/60 text-muted-foreground">
            <tr>
              <th className="p-3 font-medium text-foreground">Nama & Email</th>
              <th className="p-3 font-medium text-foreground">Peran</th>
              <th className="p-3 font-medium text-foreground">Terdaftar</th>
              <th className="p-3 font-medium text-foreground text-right">Ganti Peran</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {usersList.map((u) => (
              <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                <td className="p-3">
                  <div className="font-medium text-foreground flex items-center gap-1.5">
                    {u.role === "admin" ? (
                      <Shield className="w-3.5 h-3.5 text-foreground shrink-0" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    )}
                    <span>{u.name}</span>
                  </div>
                  <div className="font-mono text-[11px] text-muted-foreground">{u.email}</div>
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded border border-border bg-muted text-foreground font-mono text-[11px]">
                    {u.role}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground text-[11px] font-mono">
                  {new Date(u.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td className="p-3 text-right">
                  <select
                    value={u.role}
                    onChange={(e) =>
                      updateUserRoleAction(u.id, e.target.value as "admin" | "user" | "editor")
                    }
                    className="h-7 px-2 text-[11px] rounded border border-border bg-surface text-foreground cursor-pointer focus:outline-2 focus:outline-foreground"
                  >
                    <option value="user">User</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
