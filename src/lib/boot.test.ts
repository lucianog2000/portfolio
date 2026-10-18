import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BOOT_ATTRIBUTE,
  BOOT_DURATION_MS,
  BOOT_SEEN_KEY,
  bootDecisionScript,
  markBootSeen,
  runBoot,
  shouldPlayBoot,
} from "./boot.ts";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    data,
  };
}

const brokenStorage = {
  getItem: (): string | null => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("blocked");
  },
};

describe("shouldPlayBoot", () => {
  it("plays on the first visit of the session", () => {
    assert.equal(shouldPlayBoot({ prefersReducedMotion: false, storage: memoryStorage() }, BOOT_SEEN_KEY), true);
  });

  it("never plays when the visitor prefers reduced motion", () => {
    assert.equal(shouldPlayBoot({ prefersReducedMotion: true, storage: memoryStorage() }, BOOT_SEEN_KEY), false);
  });

  it("does not replay once the session has seen it", () => {
    const storage = memoryStorage({ [BOOT_SEEN_KEY]: "1" });
    assert.equal(shouldPlayBoot({ prefersReducedMotion: false, storage }, BOOT_SEEN_KEY), false);
  });

  it("stays off when session storage is unavailable, so it cannot replay on every load", () => {
    assert.equal(shouldPlayBoot({ prefersReducedMotion: false, storage: null }, BOOT_SEEN_KEY), false);
    assert.equal(shouldPlayBoot({ prefersReducedMotion: false, storage: brokenStorage }, BOOT_SEEN_KEY), false);
  });
});

describe("markBootSeen", () => {
  it("remembers the boot for the rest of the session", () => {
    const storage = memoryStorage();
    markBootSeen(storage);
    assert.equal(storage.data.get(BOOT_SEEN_KEY), "1");
  });

  it("ignores storage that refuses writes", () => {
    assert.doesNotThrow(() => markBootSeen(brokenStorage));
  });
});

describe("bootDecisionScript", () => {
  function runScript({ reduced, storage }: { reduced: boolean; storage: unknown }) {
    const attributes = new Map<string, string>();
    const window = {
      matchMedia: (query: string) => ({ matches: reduced && query === "(prefers-reduced-motion: reduce)" }),
      get sessionStorage() {
        if (storage instanceof Error) throw storage;
        return storage;
      },
    };
    const document = {
      documentElement: { setAttribute: (name: string, value: string) => attributes.set(name, value) },
    };
    new Function("window", "document", bootDecisionScript())(window, document);
    return attributes;
  }

  it("marks the document to play on a first visit", () => {
    assert.equal(runScript({ reduced: false, storage: memoryStorage() }).get(BOOT_ATTRIBUTE), "play");
  });

  it("leaves the document alone with reduced motion, a seen session, or blocked storage", () => {
    assert.equal(runScript({ reduced: true, storage: memoryStorage() }).has(BOOT_ATTRIBUTE), false);
    assert.equal(
      runScript({ reduced: false, storage: memoryStorage({ [BOOT_SEEN_KEY]: "1" }) }).has(BOOT_ATTRIBUTE),
      false,
    );
    assert.equal(runScript({ reduced: false, storage: new Error("SecurityError") }).has(BOOT_ATTRIBUTE), false);
  });
});

describe("runBoot", () => {
  function fakeRoot(playing: boolean) {
    const attributes = new Map<string, string>(playing ? [[BOOT_ATTRIBUTE, "play"]] : []);
    return {
      getAttribute: (name: string) => attributes.get(name) ?? null,
      removeAttribute: (name: string) => void attributes.delete(name),
      attributes,
    };
  }

  function fakeDeps() {
    const timers: { ms: number; fn: () => void }[] = [];
    const listeners = new Map<string, () => void>();
    return {
      storage: memoryStorage(),
      setTimeout: (fn: () => void, ms: number) => timers.push({ fn, ms }),
      addEventListener: (type: string, fn: () => void) => void listeners.set(type, fn),
      removeEventListener: (type: string) => void listeners.delete(type),
      timers,
      listeners,
    };
  }

  it("does nothing when the head script decided not to play", () => {
    const root = fakeRoot(false);
    const deps = fakeDeps();
    runBoot(root, deps);
    assert.equal(deps.timers.length, 0);
    assert.equal(deps.storage.data.size, 0);
  });

  it("remembers the session and ends the boot after its duration", () => {
    const root = fakeRoot(true);
    const deps = fakeDeps();
    runBoot(root, deps);
    assert.equal(deps.storage.data.get(BOOT_SEEN_KEY), "1");
    assert.equal(deps.timers[0]?.ms, BOOT_DURATION_MS);
    deps.timers[0]?.fn();
    assert.equal(root.getAttribute(BOOT_ATTRIBUTE), null);
    assert.equal(deps.listeners.size, 0);
  });

  it("lets a click or a key press skip straight to the page", () => {
    for (const event of ["pointerdown", "keydown"]) {
      const root = fakeRoot(true);
      const deps = fakeDeps();
      runBoot(root, deps);
      deps.listeners.get(event)?.();
      assert.equal(root.getAttribute(BOOT_ATTRIBUTE), null, event);
      assert.equal(deps.listeners.size, 0, event);
    }
  });
});
