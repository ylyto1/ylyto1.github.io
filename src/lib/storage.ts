// Lightweight typed localStorage layer. Swap implementations later for a backend.

export interface LeadItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string;
  items?: LeadItem[];
  total?: number;
  createdAt: string;
}

export interface TrackingConfig {
  metaPixelId: string;
  gaId: string;
}

export interface ProductGroup {
  id: string;
  name: string;
  price: number;
  images: string[];
}

const KEYS = {
  leads: "ylyto.leads",
  tracking: "ylyto.tracking",
  products: "ylyto.products.v2",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const leadsStore = {
  list: () => read<Lead[]>(KEYS.leads, []),
  add: (lead: Omit<Lead, "id" | "createdAt">) => {
    const items = leadsStore.list();
    const next: Lead = { ...lead, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    write(KEYS.leads, [next, ...items]);
    return next;
  },
  remove: (id: string) => {
    write(
      KEYS.leads,
      leadsStore.list().filter((l) => l.id !== id),
    );
  },
  clear: () => write(KEYS.leads, []),
};

export const trackingStore = {
  get: (): TrackingConfig => read<TrackingConfig>(KEYS.tracking, { metaPixelId: "", gaId: "" }),
  set: (cfg: TrackingConfig) => write(KEYS.tracking, cfg),
};

const defaultProducts: ProductGroup[] = [
  {
    id: "p1",
    name: "Produit 1 — Robe Rose\u00a0",
    price: 279,
    images: [
      "https://cdn.ylyto.ma/ylyto/2.webp",
      "https://cdn.ylyto.ma/ylyto/4.webp",
      "https://cdn.ylyto.ma/ylyto/10.png",
    ],
  },
  {
    id: "p2",
    name: "Produit 2 — Robe Fleurie",
    price: 259,
    images: [
      "https://cdn.ylyto.ma/ylyto/1.webp",
      "https://cdn.ylyto.ma/ylyto/6.png",
      "https://cdn.ylyto.ma/ylyto/7.jpeg",
      "https://cdn.ylyto.ma/ylyto/8.jpeg",
    ],
  },
  {
    id: "p3",
    name: "Produit 3 — Tee Petite Star",
    price: 199,
    images: [
      "https://cdn.ylyto.ma/ylyto/9.jpeg",
      "https://cdn.ylyto.ma/ylyto/11.png",
      "https://cdn.ylyto.ma/ylyto/5.webp",
      "https://cdn.ylyto.ma/ylyto/3.webp",
    ],
  },
];

export const productsStore = {
  list: (): ProductGroup[] => {
    let cur = read<ProductGroup[]>(KEYS.products, []);
    if (cur.length === 0) {
      write(KEYS.products, defaultProducts);
      return defaultProducts;
    }
    // Migration: rename products if they have old names
    let changed = false;
    cur = cur.map(p => {
      if (p.name === "Produit 1 — Combinaison Étoile" || p.name === "Produit 1 — Robe Rose") {
        changed = true;
        return { ...p, name: "Produit 1 — Robe Rose\u00a0" };
      }
      if (p.name === "Produit 2 — Ensemble Rose Câlin") {
        changed = true;
        return { ...p, name: "Produit 2 — Robe Fleurie" };
      }
      return p;
    });
    if (changed) write(KEYS.products, cur);
    return cur;
  },
  save: (items: ProductGroup[]) => {
    write(KEYS.products, items);
    return items;
  },
  update: (id: string, patch: Partial<ProductGroup>) => {
    const next = productsStore.list().map((p) => (p.id === id ? { ...p, ...patch } : p));
    return productsStore.save(next);
  },
  add: (): ProductGroup[] => {
    const items = productsStore.list();
    const n = items.length + 1;
    const next: ProductGroup = {
      id: crypto.randomUUID(),
      name: `Produit ${n}`,
      price: 199,
      images: [],
    };
    return productsStore.save([...items, next]);
  },
  remove: (id: string) => productsStore.save(productsStore.list().filter((p) => p.id !== id)),
  move: (id: string, dir: -1 | 1) => {
    const items = [...productsStore.list()];
    const i = items.findIndex((p) => p.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= items.length) return items;
    [items[i], items[j]] = [items[j], items[i]];
    return productsStore.save(items);
  },
  addImage: (id: string, url: string) => {
    if (!url.trim()) return productsStore.list();
    return productsStore.update(id, {
      images: [...(productsStore.list().find((p) => p.id === id)?.images ?? []), url.trim()],
    });
  },
  removeImage: (id: string, index: number) => {
    const p = productsStore.list().find((x) => x.id === id);
    if (!p) return productsStore.list();
    const images = p.images.filter((_, i) => i !== index);
    return productsStore.update(id, { images });
  },
  moveImage: (id: string, index: number, dir: -1 | 1) => {
    const p = productsStore.list().find((x) => x.id === id);
    if (!p) return productsStore.list();
    const images = [...p.images];
    const j = index + dir;
    if (j < 0 || j >= images.length) return productsStore.list();
    [images[index], images[j]] = [images[j], images[index]];
    return productsStore.update(id, { images });
  },
  reset: () => productsStore.save(defaultProducts),
};

// Auth is now handled by Lovable Cloud (Supabase). See /auth and /admin routes.
