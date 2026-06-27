import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "YLYTO — Connexion admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fn =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });
    const { error } = await fn;
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate({ to: "/admin" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cream via-background to-secondary p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-pop"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-gradient-pink-sun text-white">
            <Lock className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl">Admin YLYTO</h1>
            <p className="text-xs text-muted-foreground">
              {mode === "signin" ? "Connexion sécurisée" : "Créer un compte"}
            </p>
          </div>
        </div>

        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-semibold">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border-2 border-border bg-background px-3 py-2.5 outline-none focus:border-pink"
            required
          />
        </label>
        <label className="mb-4 block">
          <span className="mb-1 block text-xs font-semibold">Mot de passe</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            className="w-full rounded-xl border-2 border-border bg-background px-3 py-2.5 outline-none focus:border-pink"
            required
          />
        </label>

        {error && (
          <p className="mb-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}

        <button
          disabled={loading}
          className="w-full rounded-full bg-gradient-pink-sun py-2.5 text-sm font-bold text-white shadow-pop hover:scale-[1.01] disabled:opacity-60"
        >
          {loading ? "..." : mode === "signin" ? "Se connecter" : "Créer le compte"}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "signin"
            ? "Pas de compte ? Créer un compte"
            : "Déjà inscrit ? Se connecter"}
        </button>

        <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-[11px] text-muted-foreground">
          Seuls les comptes auxquels le rôle <strong>admin</strong> a été attribué peuvent accéder au tableau de bord.
        </p>
      </form>
    </div>
  );
}
