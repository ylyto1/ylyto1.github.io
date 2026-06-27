// Lightweight typed localStorage layer. Swap implementations later for a backend.

export interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string;
  createdAt: string;
}

export interface TrackingConfig {
  metaPixelId: string;
  gaId: string;
}

export interface ProductPrice {
  id: string;
  name: string;
  price: number;
  image: string;
}

const KEYS = {
  leads: "ylyto.leads",
  tracking: "ylyto.tracking",
  prices: "ylyto.prices",
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

const defaultPrices: ProductPrice[] = [
  { id: "1", name: "Ensemble Rose Câlin", price: 249, image: "https://cdn.ylyto.ma/ylyto/1.webp" },
  { id: "2", name: "Combinaison Étoile", price: 279, image: "https://cdn.ylyto.ma/ylyto/2.webp" },
  { id: "3", name: "Robe Bonbon", price: 229, image: "https://cdn.ylyto.ma/ylyto/3.webp" },
  { id: "4", name: "Pyjama Nuage", price: 199, image: "https://cdn.ylyto.ma/ylyto/4.webp" },
  { id: "5", name: "Tee Confetti", price: 149, image: "https://cdn.ylyto.ma/ylyto/5.webp" },
  { id: "6", name: "Salopette Soleil", price: 269, image: "https://cdn.ylyto.ma/ylyto/6.png" },
  { id: "7", name: "Body Doudou", price: 129, image: "https://cdn.ylyto.ma/ylyto/7.jpeg" },
  { id: "8", name: "Ensemble Câline", price: 259, image: "https://cdn.ylyto.ma/ylyto/8.jpeg" },
  { id: "9", name: "Tee Petite Star", price: 159, image: "https://cdn.ylyto.ma/ylyto/9.jpeg" },
  { id: "10", name: "Tenue Festive", price: 289, image: "https://cdn.ylyto.ma/ylyto/10.png" },
  { id: "11", name: "Robe Cerise", price: 239, image: "https://cdn.ylyto.ma/ylyto/11.png" },
];

export const pricesStore = {
  list: (): ProductPrice[] => {
    const cur = read<ProductPrice[]>(KEYS.prices, []);
    if (cur.length === 0) {
      write(KEYS.prices, defaultPrices);
      return defaultPrices;
    }
    return cur;
  },
  update: (id: string, patch: Partial<ProductPrice>) => {
    const next = pricesStore.list().map((p) => (p.id === id ? { ...p, ...patch } : p));
    write(KEYS.prices, next);
    return next;
  },
  reset: () => {
    write(KEYS.prices, defaultPrices);
    return defaultPrices;
  },
};

// Auth is now handled by Lovable Cloud (Supabase). See /auth and /admin routes.

