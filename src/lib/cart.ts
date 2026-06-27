import { useEffect, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
}

const KEY = "ylyto.cart";
type Listener = (items: CartItem[]) => void;
const listeners = new Set<Listener>();

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}
function write(items: CartItem[]) {
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l(items));
}

export const cartStore = {
  list: read,
  add: (item: Omit<CartItem, "qty">) => {
    const items = read();
    const existing = items.find((i) => i.id === item.id);
    const next = existing
      ? items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
      : [...items, { ...item, qty: 1 }];
    write(next);
    return next;
  },
  setQty: (id: string, qty: number) => {
    const items = read()
      .map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
    write(items);
    return items;
  },
  remove: (id: string) => {
    const items = read().filter((i) => i.id !== id);
    write(items);
    return items;
  },
  clear: () => write([]),
  subscribe: (l: Listener) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => read());
  useEffect(() => {
    setItems(read());
    return cartStore.subscribe(setItems);
  }, []);
  return items;
}
