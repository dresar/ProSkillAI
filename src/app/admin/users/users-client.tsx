"use client";

import * as React from "react";
import { useActionState } from "react";
import {
  createUserAction,
  updateUserAction,
  resetUserPasswordAction,
  deleteUserAction,
  updateUserRoleAction,
} from "./actions";
import {
  UserPlus,
  AlertCircle,
  Shield,
  User,
  KeyRound,
  Trash2,
  Edit,
  X,
  CheckCircle2,
  Coins,
} from "lucide-react";
import type { User as UserType } from "@/db/schema";

export function UsersClient({ usersList }: { usersList: UserType[] }) {
  const [createState, createAction, isCreating] = useActionState(createUserAction, null);
  const [openNew, setOpenNew] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<UserType | null>(null);
  const [resettingUser, setResettingUser] = React.useState<UserType | null>(null);
  const [deletingUser, setDeletingUser] = React.useState<UserType | null>(null);
  const [newPassword, setNewPassword] = React.useState("");
  const [feedback, setFeedback] = React.useState<{ error?: string; success?: string } | null>(null);
  const [isBusy, setIsBusy] = React.useState(false);

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsBusy(true);
    setFeedback(null);
    const formData = new FormData(e.currentTarget);
    const res = await updateUserAction(editingUser.id, {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as "admin" | "user" | "editor",
      aiCredits: Number(formData.get("aiCredits") || 0),
    });
    setIsBusy(false);
    if (res?.error) {
      setFeedback({ error: res.error });
    } else {
      setFeedback({ success: "Pengguna berhasil diperbarui." });
      setTimeout(() => {
        setEditingUser(null);
        setFeedback(null);
      }, 1200);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUser) return;
    setIsBusy(true);
    setFeedback(null);
    const res = await resetUserPasswordAction(resettingUser.id, newPassword);
    setIsBusy(false);
    if (res?.error) {
      setFeedback({ error: res.error });
    } else {
      setFeedback({ success: "Password berhasil direset." });
      setTimeout(() => {
        setResettingUser(null);
        setNewPassword("");
        setFeedback(null);
      }, 1200);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setIsBusy(true);
    setFeedback(null);
    const res = await deleteUserAction(deletingUser.id);
    setIsBusy(false);
    if (res?.error) {
      setFeedback({ error: res.error });
    } else {
      setDeletingUser(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Manajemen Pengguna (Admin & Editor)
          </h2>
          <p className="text-xs text-muted-foreground">
            Kelola akun staf, hak akses, kuota AI credits, dan kredensial sistem.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setOpenNew(!openNew);
            setEditingUser(null);
            setResettingUser(null);
          }}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-xs font-semibold bg-foreground text-background hover:opacity-90 transition-transform active:scale-95 cursor-pointer shadow-xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Tambah Staf</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-[6px] border text-xs flex items-center gap-2 ${
            feedback.error
              ? "border-rose-500/30 bg-rose-500/10 text-rose-500"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
          }`}
        >
          {feedback.error ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.error || feedback.success}</span>
        </div>
      )}

      {openNew && (
        <form
          action={createAction}
          className="p-4 rounded-[8px] border border-border bg-surface space-y-4 text-xs animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Tambah Akun Staf Baru</h3>
            <button
              type="button"
              onClick={() => setOpenNew(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {createState?.error && (
            <div className="p-2.5 rounded-[6px] border border-rose-500/30 bg-rose-500/10 text-rose-500 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{createState.error}</span>
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
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
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
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
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
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
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
                className="w-full h-8 px-2 rounded-[6px] border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              >
                <option value="user">User (Staf Standar)</option>
                <option value="editor">Editor (Manajemen Konten)</option>
                <option value="admin">Administrator (Akses Penuh)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="user-credits" className="block font-medium text-foreground">
                AI Credits Awal
              </label>
              <input
                id="user-credits"
                name="aiCredits"
                type="number"
                defaultValue={10}
                min={0}
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOpenNew(false)}
              className="h-8 px-3 rounded-[6px] border border-border hover:bg-muted text-foreground transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="h-8 px-4 rounded-[6px] bg-foreground text-background font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-xs"
            >
              {isCreating ? "Menyimpan..." : "Buat Akun"}
            </button>
          </div>
        </form>
      )}

      {editingUser && (
        <form
          onSubmit={handleUpdateSubmit}
          className="p-4 rounded-[8px] border border-cyan-500/40 bg-surface space-y-4 text-xs animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit className="w-4 h-4 text-cyan-500" />
              <h3 className="font-semibold text-foreground">Edit Profil: {editingUser.name}</h3>
            </div>
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-medium text-foreground">Nama Lengkap *</label>
              <input
                name="name"
                type="text"
                required
                defaultValue={editingUser.name}
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-foreground">Email *</label>
              <input
                name="email"
                type="email"
                required
                defaultValue={editingUser.email}
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-foreground">Peran (Role)</label>
              <select
                name="role"
                defaultValue={editingUser.role}
                className="w-full h-8 px-2 rounded-[6px] border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              >
                <option value="user">User (Staf Standar)</option>
                <option value="editor">Editor (Manajemen Konten)</option>
                <option value="admin">Administrator (Akses Penuh)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-foreground">AI Credits</label>
              <input
                name="aiCredits"
                type="number"
                min={0}
                defaultValue={editingUser.aiCredits}
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="h-8 px-3 rounded-[6px] border border-border hover:bg-muted text-foreground transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="h-8 px-4 rounded-[6px] bg-foreground text-background font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-xs"
            >
              {isBusy ? "Menyimpan..." : "Perbarui Akun"}
            </button>
          </div>
        </form>
      )}

      {resettingUser && (
        <form
          onSubmit={handleResetPassword}
          className="p-4 rounded-[8px] border border-amber-500/40 bg-surface space-y-4 text-xs animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-foreground">Reset Password: {resettingUser.email}</h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setResettingUser(null);
                setNewPassword("");
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <label className="block font-medium text-foreground">Password Baru (min 8 karakter)</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Masukkan password baru..."
              className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setResettingUser(null);
                setNewPassword("");
              }}
              className="h-8 px-3 rounded-[6px] border border-border hover:bg-muted text-foreground transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="h-8 px-4 rounded-[6px] bg-amber-600 text-white font-semibold hover:bg-amber-700 disabled:opacity-50 transition-all shadow-xs"
            >
              {isBusy ? "Mereset..." : "Reset Password"}
            </button>
          </div>
        </form>
      )}

      <div className="rounded-[8px] border border-border bg-surface overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/50 text-muted-foreground">
            <tr>
              <th className="p-3 font-semibold text-foreground">Nama & Email</th>
              <th className="p-3 font-semibold text-foreground">Peran</th>
              <th className="p-3 font-semibold text-foreground">AI Credits</th>
              <th className="p-3 font-semibold text-foreground">Waktu Bergabung</th>
              <th className="p-3 font-semibold text-foreground text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {usersList.map((u) => (
              <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground block">{u.name}</span>
                      <span className="text-[11px] text-muted-foreground font-mono block">
                        {u.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] border text-[11px] font-medium ${
                      u.role === "admin"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                        : u.role === "editor"
                        ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold"
                        : "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    {u.role === "admin" && <Shield className="w-3 h-3" />}
                    {u.role}
                  </span>
                </td>
                <td className="p-3 font-mono text-[11px]">
                  <span className="inline-flex items-center gap-1 text-foreground">
                    <Coins className="w-3 h-3 text-amber-500" />
                    {u.aiCredits}
                  </span>
                </td>
                <td className="p-3 font-mono text-[11px] text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="p-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUser(u);
                        setResettingUser(null);
                        setOpenNew(false);
                      }}
                      className="p-1.5 rounded-[4px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                      title="Edit Pengguna"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setResettingUser(u);
                        setEditingUser(null);
                        setOpenNew(false);
                      }}
                      className="p-1.5 rounded-[4px] text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 transition-colors cursor-pointer"
                      title="Reset Password"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingUser(u)}
                      className="p-1.5 rounded-[4px] text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Hapus Pengguna"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[8px] border border-border bg-surface p-5 space-y-4 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5 text-rose-500">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-foreground">Hapus Akun Pengguna</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus akun <strong className="text-foreground">{deletingUser.email}</strong>? Tindakan ini akan menghapus sesi dan hak akses akun secara permanen.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="h-8 px-3 rounded-[6px] border border-border text-xs text-foreground hover:bg-muted"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isBusy}
                onClick={handleDeleteUser}
                className="h-8 px-3 rounded-[6px] bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 disabled:opacity-50"
              >
                {isBusy ? "Menghapus..." : "Hapus Akun"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
