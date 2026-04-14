const REVEAL_SELECTOR = "[data-reveal]";
const ROOT_FLAG_ATTR = "data-reveal-ready";

type RevealWindow = Window & {
  __amzRevealObserver?: IntersectionObserver;
  __amzRevealBound?: boolean;
};

function toNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function applyRevealVariables(node: HTMLElement) {
  const step = toNumber(node.dataset.revealStep);
  if (typeof step === "number") {
    node.style.setProperty("--reveal-step", String(step));
  }
}

function markVisible(node: HTMLElement) {
  node.classList.add("is-visible");
}

export function initScrollReveal() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const nodes = Array.from(
    document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)
  );
  if (nodes.length < 1) return;

  document.documentElement.setAttribute(ROOT_FLAG_ATTR, "true");
  nodes.forEach(node => applyRevealVariables(node));

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const supportsObserver = "IntersectionObserver" in window;

  if (prefersReducedMotion || !supportsObserver) {
    nodes.forEach(node => markVisible(node));
    return;
  }

  const win = window as RevealWindow;
  win.__amzRevealObserver?.disconnect();

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const node = entry.target as HTMLElement;
        const repeat = node.dataset.revealRepeat === "true";

        if (entry.isIntersecting) {
          markVisible(node);
          if (!repeat) observer.unobserve(node);
          return;
        }

        if (repeat) {
          node.classList.remove("is-visible");
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  nodes.forEach(node => observer.observe(node));
  win.__amzRevealObserver = observer;
}

export function bindScrollReveal() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const win = window as RevealWindow;
  if (win.__amzRevealBound) return;

  const run = () => initScrollReveal();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }

  document.addEventListener("astro:page-load", run);
  win.__amzRevealBound = true;
}
