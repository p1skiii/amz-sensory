export const CART_STORAGE_KEY = "amz-cart-v1";

export type CartItem = {
  stable_key: string;
  slug: string;
  title: string;
  price_hkd: number;
  qty: number;
  cover: string;
};

export type CartState = {
  items: CartItem[];
  updated_at: string;
};

let cartCountBadgesBound = false;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function sanitizeQuantity(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(99, Math.max(1, Math.floor(value)));
}

function makeEmptyState(): CartState {
  return {
    items: [],
    updated_at: new Date().toISOString(),
  };
}

function sanitizeState(value: unknown): CartState {
  if (!value || typeof value !== "object") return makeEmptyState();

  const rawItems = Array.isArray((value as { items?: unknown }).items)
    ? ((value as { items: unknown[] }).items as unknown[])
    : [];

  const items = rawItems
    .map(item => {
      if (!item || typeof item !== "object") return undefined;
      const row = item as Partial<CartItem>;
      if (
        typeof row.stable_key !== "string" ||
        typeof row.slug !== "string" ||
        typeof row.title !== "string" ||
        typeof row.cover !== "string"
      ) {
        return undefined;
      }
      const price = Number(row.price_hkd);
      if (!Number.isFinite(price) || price <= 0) return undefined;
      const qty = sanitizeQuantity(Number(row.qty));
      return {
        stable_key: row.stable_key,
        slug: row.slug,
        title: row.title,
        price_hkd: price,
        qty,
        cover: row.cover,
      } satisfies CartItem;
    })
    .filter((item): item is CartItem => Boolean(item));

  return {
    items,
    updated_at:
      typeof (value as { updated_at?: unknown }).updated_at === "string"
        ? (value as { updated_at: string }).updated_at
        : new Date().toISOString(),
  };
}

export function readCart(): CartState {
  if (!isBrowser()) return makeEmptyState();
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return makeEmptyState();
    return sanitizeState(JSON.parse(raw));
  } catch {
    return makeEmptyState();
  }
}

function notifyCartChanged(state: CartState) {
  if (!isBrowser()) return;
  window.dispatchEvent(
    new CustomEvent<CartState>("amz-cart:changed", {
      detail: state,
    })
  );
}

export function writeCart(state: CartState): CartState {
  const normalized = sanitizeState(state);
  normalized.updated_at = new Date().toISOString();
  if (!isBrowser()) return normalized;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalized));
  notifyCartChanged(normalized);
  return normalized;
}

export function addToCart(
  payload: Omit<CartItem, "qty">,
  quantity = 1
): CartState {
  const state = readCart();
  const qty = sanitizeQuantity(quantity);
  const existing = state.items.find(
    item => item.stable_key === payload.stable_key
  );

  if (existing) {
    existing.qty = sanitizeQuantity(existing.qty + qty);
  } else {
    state.items.push({
      ...payload,
      qty,
    });
  }

  return writeCart(state);
}

export function updateCartQty(stableKey: string, qty: number): CartState {
  const state = readCart();
  const target = state.items.find(item => item.stable_key === stableKey);
  if (!target) return state;

  if (qty <= 0) {
    state.items = state.items.filter(item => item.stable_key !== stableKey);
  } else {
    target.qty = sanitizeQuantity(qty);
  }
  return writeCart(state);
}

export function removeFromCart(stableKey: string): CartState {
  const state = readCart();
  state.items = state.items.filter(item => item.stable_key !== stableKey);
  return writeCart(state);
}

export function clearCart(): CartState {
  return writeCart(makeEmptyState());
}

export function getCartCount(state = readCart()): number {
  return state.items.reduce((sum, item) => sum + item.qty, 0);
}

export function getCartSubtotal(state = readCart()): number {
  return state.items.reduce((sum, item) => sum + item.price_hkd * item.qty, 0);
}

export function bindCartAddButtons() {
  if (!isBrowser()) return;
  const buttons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-cart-add]")
  );
  for (const button of buttons) {
    if (button.dataset.cartAddBound === "true") continue;
    button.dataset.cartAddBound = "true";

    button.addEventListener("click", () => {
      const stableKey = button.dataset.stableKey;
      const slug = button.dataset.slug;
      const title = button.dataset.title;
      const cover = button.dataset.cover;
      const price = Number(button.dataset.price);
      if (!stableKey || !slug || !title || !cover || !Number.isFinite(price)) {
        return;
      }
      addToCart(
        {
          stable_key: stableKey,
          slug,
          title,
          cover,
          price_hkd: price,
        },
        1
      );

      const previousLabel = button.textContent ?? "";
      button.textContent = button.dataset.addedLabel ?? "Added";
      window.setTimeout(() => {
        button.textContent = previousLabel;
      }, 900);
    });
  }
}

export function bindCartCountBadges() {
  if (!isBrowser()) return;

  const sync = () => {
    const state = readCart();
    const count = getCartCount(state);
    document
      .querySelectorAll<HTMLElement>("[data-cart-count]")
      .forEach(node => {
        node.textContent = String(count);
      });
  };

  sync();
  if (cartCountBadgesBound) return;

  window.addEventListener("amz-cart:changed", sync);
  cartCountBadgesBound = true;
}
