export const BOOT_SEEN_KEY = "boot-seen";
export const BOOT_ATTRIBUTE = "data-boot";
export const BOOT_DURATION_MS = 900;

type SessionStore = Pick<Storage, "getItem" | "setItem">;

export interface BootEnvironment {
  prefersReducedMotion: boolean;
  storage: Pick<Storage, "getItem"> | null;
}

export function shouldPlayBoot(env: BootEnvironment, seenKey: string): boolean {
  if (env.prefersReducedMotion || !env.storage) return false;
  try {
    return env.storage.getItem(seenKey) === null;
  } catch {
    return false;
  }
}

export function markBootSeen(storage: SessionStore | null): void {
  try {
    storage?.setItem(BOOT_SEEN_KEY, "1");
  } catch {
    return;
  }
}

interface BootRoot {
  getAttribute(name: string): string | null;
  removeAttribute(name: string): void;
}

interface BootDeps {
  storage: SessionStore | null;
  setTimeout(fn: () => void, ms: number): unknown;
  addEventListener(type: string, fn: () => void): void;
  removeEventListener(type: string, fn: () => void): void;
}

const SKIP_EVENTS = ["pointerdown", "keydown"] as const;

export function runBoot(root: BootRoot, deps: BootDeps): void {
  if (root.getAttribute(BOOT_ATTRIBUTE) !== "play") return;
  markBootSeen(deps.storage);

  const end = () => {
    root.removeAttribute(BOOT_ATTRIBUTE);
    for (const type of SKIP_EVENTS) deps.removeEventListener(type, end);
  };
  for (const type of SKIP_EVENTS) deps.addEventListener(type, end);
  deps.setTimeout(end, BOOT_DURATION_MS);
}

export function bootDecisionScript(): string {
  const readStorage = `(() => { try { return window.sessionStorage; } catch { return null; } })()`;
  const env = `{ prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches, storage: ${readStorage} }`;
  return `if ((${shouldPlayBoot.toString()})(${env}, ${JSON.stringify(BOOT_SEEN_KEY)})) document.documentElement.setAttribute(${JSON.stringify(BOOT_ATTRIBUTE)}, "play");`;
}
