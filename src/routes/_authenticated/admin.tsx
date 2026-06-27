import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { LogOut, Trash2, RefreshCcw, Save, ShieldAlert, Plus, ArrowUp, ArrowDown, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  leadsStore,
  productsStore,
  trackingStore,
  type Lead,
  type ProductGroup,
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
  const [items, setItems] = useState<ProductGroup[]>([]);
  const [newImg, setNewImg] = useState<Record<string, string>>({});
  useEffect(() => setItems(productsStore.list()), []);

  const update = (id: string, patch: Partial<ProductGroup>) => setItems(productsStore.update(id, patch));
  const move = (id: string, dir: -1 | 1) => setItems(productsStore.move(id, dir));
  const remove = (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    setItems(productsStore.remove(id));
  };
  const addGroup = () => setItems(productsStore.add());
  const addImg = (id: string) => {
    const url = newImg[id];
    if (!url) return;
    setItems(productsStore.addImage(id, url));
    setNewImg((s) => ({ ...s, [id]: "" }));
  };
  const removeImg = (id: string, idx: number) => setItems(productsStore.removeImage(id, idx));
  const moveImg = (id: string, idx: number, dir: -1 | 1) => setItems(productsStore.moveImage(id, idx, dir));
  const reset = () => {
    if (!confirm("Réinitialiser tous les produits par défaut ?")) return;
    setItems(productsStore.reset());
  };

  return (
    <section className="rounded-3xl bg-card p-6 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl">Produits & Prix ({items.length})</h2>
        <div className="flex gap-2">
          <button
            onClick={addGroup}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-pink-sun px-3 py-1.5 text-xs font-semibold text-white shadow-pop"
          >
            <Plus className="size-3" /> Ajouter un produit
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
          >
            <RefreshCcw className="size-3" /> Réinitialiser
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((p, i) => (
          <div key={p.id} className="rounded-2xl border border-border bg-background p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <div className="flex gap-1">
                <button
                  onClick={() => move(p.id, -1)}
                  disabled={i === 0}
                  className="grid size-7 place-items-center rounded-lg border border-border hover:bg-secondary disabled:opacity-30"
                  title="Monter"
                >
                  <ArrowUp className="size-3" />
                </button>
                <button
                  onClick={() => move(p.id, 1)}
                  disabled={i === items.length - 1}
                  className="grid size-7 place-items-center rounded-lg border border-border hover:bg-secondary disabled:opacity-30"
                  title="Descendre"
                >
                  <ArrowDown className="size-3" />
                </button>
              </div>
              <input
                value={p.name}
                onChange={(e) => update(p.id, { name: e.target.value })}
                className="min-w-0 flex-1 rounded-lg border border-border bg-card px-2 py-1 text-sm font-semibold outline-none focus:border-pink"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  value={p.price}
                  onChange={(e) => update(p.id, { price: Number(e.target.value) })}
                  className="w-24 rounded-lg border border-border bg-card px-2 py-1 text-sm outline-none focus:border-pink"
                />
                <span className="text-xs text-muted-foreground">MAD</span>
              </div>
              <button
                onClick={() => remove(p.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-3" /> Supprimer
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {p.images.map((src, idx) => (
                <div key={`${src}-${idx}`} className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-secondary">
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-x-1 bottom-1 flex justify-between gap-1 opacity-0 transition group-hover:opacity-100">
                    <div className="flex gap-1">
                      <button
                        onClick={() => moveImg(p.id, idx, -1)}
                        disabled={idx === 0}
                        className="grid size-6 place-items-center rounded-md bg-black/60 text-white disabled:opacity-30"
                      >
                        <ArrowUp className="size-3" />
                      </button>
                      <button
                        onClick={() => moveImg(p.id, idx, 1)}
                        disabled={idx === p.images.length - 1}
                        className="grid size-6 place-items-center rounded-md bg-black/60 text-white disabled:opacity-30"
                      >
                        <ArrowDown className="size-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeImg(p.id, idx)}
                      className="grid size-6 place-items-center rounded-md bg-destructive text-white"
                      title="Supprimer l'image"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={newImg[p.id] ?? ""}
                onChange={(e) => setNewImg((s) => ({ ...s, [p.id]: e.target.value }))}
                placeholder="URL d'une nouvelle image (https://…)"
                className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs outline-none focus:border-pink"
              />
              <button
                onClick={() => addImg(p.id)}
                className="inline-flex items-center gap-1 rounded-lg bg-violet px-3 py-1.5 text-xs font-semibold text-white"
              >
                <Plus className="size-3" /> Ajouter
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

