import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { LogOut, Trash2, RefreshCcw, Save, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  leadsStore,
  pricesStore,
  trackingStore,
  type Lead,
  type ProductPrice,
  type TrackingConfig,
} from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "YLYTO — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "admin" | "forbidden">("checking");
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) {
        navigate({ to: "/auth" });
        return;
      }
      setEmail(user.email ?? "");
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setStatus(!error && data ? "admin" : "forbidden");
    })();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (status === "checking") {
    return (
      <div className="grid min-h-screen place-items-center bg-gradient-to-br from-cream via-background to-secondary">
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  if (status === "forbidden") {
    return (
      <div className="grid min-h-screen place-items-center bg-gradient-to-br from-cream via-background to-secondary p-6">
        <div className="w-full max-w-md rounded-3xl bg-card p-8 text-center shadow-pop">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-destructive/15 text-destructive">
            <ShieldAlert className="size-5" />
          </div>
          <h1 className="mt-4 text-2xl">Accès refusé</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Le compte <strong>{email}</strong> n'a pas le rôle administrateur.
          </p>
          <button
            onClick={signOut}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-secondary"
          >
            <LogOut className="size-4" /> Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-secondary">
      <Dashboard email={email} onSignOut={signOut} />
    </div>
  );
}

type Tab = "leads" | "tracking" | "prices";

function Dashboard({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const [tab, setTab] = useState<Tab>("leads");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">YLYTO Admin</h1>
          <p className="text-sm text-muted-foreground">Connecté en tant que {email}</p>
        </div>
        <button
          onClick={onSignOut}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary"
        >
          <LogOut className="size-4" /> Déconnexion
        </button>
      </header>

      <nav className="mb-6 inline-flex rounded-full border border-border bg-card p-1 shadow-soft">
        {(
          [
            ["leads", "Prospects"],
            ["tracking", "Tracking"],
            ["prices", "Produits & Prix"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === id ? "bg-gradient-violet-sky text-white shadow-pop" : "text-foreground/70 hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "leads" && <LeadsPanel />}
      {tab === "tracking" && <TrackingPanel />}
      {tab === "prices" && <PricesPanel />}
    </div>
  );
}

function LeadsPanel() {
  const [items, setItems] = useState<Lead[]>([]);
  useEffect(() => setItems(leadsStore.list()), []);
  const remove = (id: string) => {
    leadsStore.remove(id);
    setItems(leadsStore.list());
  };
  const clear = () => {
    if (!confirm("Supprimer tous les prospects ?")) return;
    leadsStore.clear();
    setItems([]);
  };

  return (
    <section className="rounded-3xl bg-card p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl">Prospects ({items.length})</h2>
        {items.length > 0 && (
          <button onClick={clear} className="text-xs font-semibold text-destructive hover:underline">
            Tout supprimer
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl bg-muted px-4 py-10 text-center text-sm text-muted-foreground">
          Aucun prospect pour le moment.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted-foreground">
                <th className="py-2">Nom</th>
                <th className="py-2">Téléphone</th>
                <th className="py-2">Ville</th>
                <th className="py-2">Date</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((l) => (
                <tr key={l.id} className="border-t border-border">
                  <td className="py-2 font-medium">{l.name}</td>
                  <td className="py-2">
                    <a href={`tel:${l.phone}`} className="text-violet hover:underline">
                      {l.phone}
                    </a>
                  </td>
                  <td className="py-2">{l.city}</td>
                  <td className="py-2 text-xs text-muted-foreground">
                    {new Date(l.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => remove(l.id)}
                      className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3" /> Suppr.
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function TrackingPanel() {
  const [cfg, setCfg] = useState<TrackingConfig>({ metaPixelId: "", gaId: "" });
  const [saved, setSaved] = useState(false);
  useEffect(() => setCfg(trackingStore.get()), []);

  const save = (e: FormEvent) => {
    e.preventDefault();
    trackingStore.set(cfg);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <section className="rounded-3xl bg-card p-6 shadow-soft">
      <h2 className="text-xl">Tracking</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Configurez Meta Pixel et Google Analytics. Les scripts sont injectés automatiquement sur le site.
      </p>

      <form onSubmit={save} className="mt-5 grid max-w-lg gap-4">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold">Meta Pixel ID</span>
          <input
            value={cfg.metaPixelId}
            onChange={(e) => setCfg({ ...cfg, metaPixelId: e.target.value })}
            placeholder="123456789012345"
            className="w-full rounded-xl border-2 border-border bg-background px-3 py-2.5 outline-none focus:border-pink"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold">Google Analytics ID</span>
          <input
            value={cfg.gaId}
            onChange={(e) => setCfg({ ...cfg, gaId: e.target.value })}
            placeholder="G-XXXXXXXXXX"
            className="w-full rounded-xl border-2 border-border bg-background px-3 py-2.5 outline-none focus:border-pink"
          />
        </label>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-full bg-gradient-pink-sun px-5 py-2.5 text-sm font-bold text-white shadow-pop">
            <Save className="size-4" /> Enregistrer
          </button>
          {saved && <span className="text-sm text-sky">Enregistré ✓</span>}
        </div>
      </form>
    </section>
  );
}

function PricesPanel() {
  const [items, setItems] = useState<ProductPrice[]>([]);
  useEffect(() => setItems(pricesStore.list()), []);

  const update = (id: string, patch: Partial<ProductPrice>) => {
    setItems(pricesStore.update(id, patch));
  };
  const reset = () => {
    if (!confirm("Réinitialiser tous les produits par défaut ?")) return;
    setItems(pricesStore.reset());
  };

  return (
    <section className="rounded-3xl bg-card p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl">Produits & Prix</h2>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
        >
          <RefreshCcw className="size-3" /> Réinitialiser
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3">
            <img src={p.image} alt="" className="size-16 shrink-0 rounded-xl object-cover" loading="lazy" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <input
                value={p.name}
                onChange={(e) => update(p.id, { name: e.target.value })}
                className="w-full rounded-lg border border-transparent bg-transparent px-1 py-0.5 text-sm font-semibold outline-none focus:border-border focus:bg-card"
              />
              <input
                value={p.image}
                onChange={(e) => update(p.id, { image: e.target.value })}
                placeholder="URL image"
                className="w-full rounded-lg border border-border bg-card px-2 py-1 text-[11px] text-muted-foreground outline-none focus:border-pink"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={p.price}
                  onChange={(e) => update(p.id, { price: Number(e.target.value) })}
                  className="w-24 rounded-lg border border-border bg-card px-2 py-1 text-sm outline-none focus:border-pink"
                />
                <span className="text-xs text-muted-foreground">MAD</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
