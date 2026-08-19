import { s as sanitize_props, a as spread_props, c as slot, f as attr_class, af as clsx, g as attr, d as ensure_array_like, an as hasContext, ac as getContext, ab as setContext, h as derived, ao as run, j as attr_style, e as escape_html, k as stringify, ai as attributes, i as head } from "../../../chunks/index.js";
import { g as goto, p as page } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import { g as gToSA, a as audioUrl, p as pageRange, b as pageOf, S as SURAHS, T as TOTAL_PAGES } from "../../../chunks/meta.js";
import { b as settings, S as SideNav } from "../../../chunks/SideNav.js";
import "clsx";
import { I as Icon } from "../../../chunks/Icon.js";
import { C as Chevron_left } from "../../../chunks/chevron-left.js";
import { S as Settings } from "../../../chunks/settings.js";
import { C as Chevron_right } from "../../../chunks/chevron-right.js";
function Square($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.511.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    [
      "rect",
      { "width": "18", "height": "18", "x": "3", "y": "3", "rx": "2" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "square" },
    $$sanitized_props,
    {
      /**
       * @component @name Square
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/square
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
const RECITATION_ALAFASY = 7;
const cache = /* @__PURE__ */ new Map();
const inflight = /* @__PURE__ */ new Map();
async function loadChapterTimings(surah) {
  if (cache.has(surah)) return;
  const pending = inflight.get(surah);
  if (pending) return pending;
  const p = (async () => {
    try {
      const res = await fetch(
        `https://api.quran.com/api/qdc/audio/reciters/${RECITATION_ALAFASY}/audio_files?chapter=${surah}&segments=true`
      );
      const data = await res.json();
      const timings = data?.audio_files?.[0]?.verse_timings ?? [];
      const m = /* @__PURE__ */ new Map();
      for (const vt of timings) {
        const ayah = Number(String(vt.verse_key).split(":")[1]);
        const from = vt.timestamp_from ?? 0;
        const segs = [];
        for (const s of vt.segments ?? []) {
          if (!Array.isArray(s) || s.length < 3) continue;
          const start = Math.max(0, s[1] - from);
          const end = Math.max(start, s[2] - from);
          segs.push([start, end]);
        }
        if (segs.length) m.set(ayah, segs);
      }
      cache.set(surah, m);
    } catch {
      cache.set(surah, /* @__PURE__ */ new Map());
    }
  })();
  inflight.set(surah, p);
  try {
    await p;
  } finally {
    inflight.delete(surah);
  }
}
function segmentsFor(surah, ayah) {
  return cache.get(surah)?.get(ayah) ?? null;
}
function wordAt(segs, ms) {
  let idx = -1;
  for (let i = 0; i < segs.length; i++) {
    if (ms >= segs[i][0]) idx = i;
    else break;
  }
  return idx < 0 ? -1 : idx + 1;
}
class Player {
  playingG = -1;
  // 1-based global; -1 = idle
  /** 1-based index of the word the reciter is on within the current ayah
   *  (Alafasy only, from word timings); -1 when unknown/none. */
  currentWord = -1;
  abStart = -1;
  abEnd = -1;
  abActive = false;
  /** Surah whose Basmalah the reciter is currently on — drives a distinct
   *  (gold) highlight on that line. null when not reciting a Basmalah. */
  basmalahSurah = null;
  /** set true while the player itself navigates the reader (keepAudio) */
  navigating = false;
  onError = null;
  #audio = null;
  #playedCount = 0;
  /** The ayah to recite once the current Basmalah pre-roll finishes. */
  #pendingAfterBasmalah = -1;
  /** Consecutive failed load/play attempts for the current audio, plus the pending
   *  retry timer — so a transient CDN/network blip retries instead of giving up. */
  #retries = 0;
  #retryTimer = null;
  /** Word segments for the currently-playing ayah (Alafasy), or null. */
  #segs = null;
  get audio() {
    if (!this.#audio) {
      this.#audio = new Audio();
      this.#audio.addEventListener("ended", () => this.#onEnded());
      this.#audio.addEventListener("loadeddata", () => {
        if (this.#audio) this.#audio.playbackRate = settings.value.speed;
      });
      this.#audio.addEventListener("playing", () => {
        this.#retries = 0;
      });
      this.#audio.addEventListener("timeupdate", () => {
        if (!this.#segs || this.playingG < 0 || this.basmalahSurah !== null) return;
        const ms = (this.#audio?.currentTime ?? 0) * 1e3;
        const w = wordAt(this.#segs, ms);
        if (w !== this.currentWord) this.currentWord = w;
      });
      this.#audio.addEventListener("error", () => this.#onAudioFail());
    }
    return this.#audio;
  }
  /** Public entry: begin recitation at global g — reciting the Basmalah first
   *  when g opens a surah (see #startAyah). */
  playFrom(g) {
    this.#startAyah(g);
  }
  /**
   * Recite the Basmalah before a surah's opening ayah, then the ayah itself.
   * Skipped for Al-Fatihah (its Basmalah IS ayah 1, already played) and
   * At-Tawbah (no Basmalah). The Basmalah audio reuses global 1 — Al-Fatihah 1:1.
   */
  #startAyah(g) {
    return;
  }
  /** Play a single ayah's audio directly (no Basmalah pre-roll). */
  #playAyahRaw(g) {
    return;
  }
  /** Prepare word-by-word timings for ayah g (Alafasy only; a no-op otherwise). */
  #loadWordTimings(g) {
    this.currentWord = -1;
    this.#segs = null;
    if (settings.value.qari !== "ar.alafasy") return;
    const { s, a } = gToSA(g);
    const cached = segmentsFor(s, a);
    if (cached) {
      this.#segs = cached;
      return;
    }
    void loadChapterTimings(s).then(() => {
      if (this.playingG === g && this.basmalahSurah === null) this.#segs = segmentsFor(s, a);
    });
  }
  /**
   * A load/play failure. Transient CDN or network blips are common on mobile, so
   * retry the current audio a few times (with backoff) before giving up — rather
   * than killing playback and flashing "check your internet" on the first hiccup.
   * Duplicate 'error' events while a retry is already queued are ignored.
   */
  #onAudioFail() {
    if (this.playingG < 0 || this.#retryTimer) return;
    if (this.#retries >= 3) {
      this.#retries = 0;
      this.onError?.("audio");
      this.stop();
      return;
    }
    this.#retries++;
    const g = this.playingG;
    const basmalah = this.basmalahSurah !== null;
    this.#retryTimer = setTimeout(
      () => {
        this.#retryTimer = null;
        if (this.playingG !== g) return;
        const a = this.audio;
        a.src = audioUrl(settings.value.qari, basmalah ? 1 : g);
        a.playbackRate = settings.value.speed;
        void a.play().catch(() => this.#onAudioFail());
      },
      500 * this.#retries
    );
  }
  playPage(p) {
    this.playFrom(pageRange(p)[0]);
  }
  toggle(g) {
    if (this.playingG === g) this.stop();
    else this.playFrom(g);
  }
  stop() {
    if (this.#audio) {
      this.#audio.pause();
      this.#audio.removeAttribute("src");
    }
    this.playingG = -1;
    this.currentWord = -1;
    this.#segs = null;
    this.#playedCount = 0;
    this.basmalahSurah = null;
    this.#pendingAfterBasmalah = -1;
    if (this.#retryTimer) {
      clearTimeout(this.#retryTimer);
      this.#retryTimer = null;
    }
    this.#retries = 0;
    this.abActive = false;
    this.abStart = -1;
    this.abEnd = -1;
  }
  /** A–B loop setup: first call sets A, second sets B (swapped if reversed) and starts. */
  setAB(g) {
    if (this.abActive) {
      this.stop();
      return "stopped";
    }
    if (this.abStart < 0) {
      this.abStart = g;
      return "a-set";
    }
    this.abEnd = g;
    if (this.abEnd < this.abStart) [this.abStart, this.abEnd] = [this.abEnd, this.abStart];
    this.abActive = true;
    this.#gotoPageOf(this.abStart);
    this.playFrom(this.abStart);
    return "started";
  }
  /** re-play current ayah with the new qari (sample behaviour on qari change) */
  qariChanged() {
    if (this.playingG >= 0) this.playFrom(this.playingG);
  }
  speedChanged() {
    if (this.#audio) this.#audio.playbackRate = settings.value.speed;
  }
  repeatChanged() {
    this.#playedCount = 0;
  }
  #gotoPageOf(g) {
    const p = pageOf(g);
    if (p !== pageOf(this.playingG >= 1 ? this.playingG : g) || p !== settings.value.page) {
      this.navigating = true;
      goto().finally(() => this.navigating = false);
    }
  }
  #onEnded() {
    if (this.basmalahSurah !== null) {
      this.basmalahSurah = null;
      this.#playAyahRaw(this.#pendingAfterBasmalah);
      return;
    }
    const g = this.playingG;
    if (g < 0) return;
    this.#playedCount++;
    if (this.#playedCount < settings.value.repeat) {
      const a = this.audio;
      a.currentTime = 0;
      a.play().catch(() => this.stop());
      return;
    }
    this.#playedCount = 0;
    if (this.abActive) {
      let nx = g + 1;
      if (nx > this.abEnd) nx = this.abStart;
      this.#gotoPageOf(nx);
      this.playFrom(nx);
      return;
    }
    const page2 = pageOf(g);
    const [, last] = pageRange(page2);
    if (g < last) {
      this.playFrom(g + 1);
      return;
    }
    if (page2 < 604) {
      this.navigating = true;
      goto().finally(() => this.navigating = false);
      this.playFrom(g + 1);
      return;
    }
    this.stop();
  }
  #updateMediaSession(g) {
    if (!("mediaSession" in navigator)) return;
    const { s, a } = gToSA(g);
    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${SURAHS[s - 1].name_translit} · ${s}:${a}`,
      artist: "Cakna",
      album: "Al-Quran"
    });
    navigator.mediaSession.setActionHandler("play", () => this.audio.play());
    navigator.mediaSession.setActionHandler("pause", () => this.audio.pause());
    navigator.mediaSession.setActionHandler("stop", () => this.stop());
  }
}
const player = new Player();
const bars = Array(12).fill(0);
function Loader($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { visible, class: className } = $$props;
    $$renderer2.push(`<div${attr_class(clsx(["sonner-loading-wrapper", className].filter(Boolean).join(" ")))}${attr("data-visible", visible)}><div class="sonner-spinner"><!--[-->`);
    const each_array = ensure_array_like(bars);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      each_array[i];
      $$renderer2.push(`<div class="sonner-loading-bar"></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
const isBrowser = typeof document !== "undefined";
const defaultWindow = void 0;
function getActiveElement(document2) {
  let activeElement = document2.activeElement;
  while (activeElement?.shadowRoot) {
    const node = activeElement.shadowRoot.activeElement;
    if (node === activeElement)
      break;
    else
      activeElement = node;
  }
  return activeElement;
}
function createSubscriber(_) {
  return () => {
  };
}
class ActiveElement {
  #document;
  #subscribe;
  constructor(options = {}) {
    const { window: window2 = defaultWindow, document: document2 = window2?.document } = options;
    if (window2 === void 0) return;
    this.#document = document2;
    this.#subscribe = createSubscriber();
  }
  get current() {
    this.#subscribe?.();
    if (!this.#document) return null;
    return getActiveElement(this.#document);
  }
}
new ActiveElement();
class Context {
  #name;
  #key;
  /**
   * @param name The name of the context.
   * This is used for generating the context key and error messages.
   */
  constructor(name) {
    this.#name = name;
    this.#key = Symbol(name);
  }
  /**
   * The key used to get and set the context.
   *
   * It is not recommended to use this value directly.
   * Instead, use the methods provided by this class.
   */
  get key() {
    return this.#key;
  }
  /**
   * Checks whether this has been set in the context of a parent component.
   *
   * Must be called during component initialisation.
   */
  exists() {
    return hasContext(this.#key);
  }
  /**
   * Retrieves the context that belongs to the closest parent component.
   *
   * Must be called during component initialisation.
   *
   * @throws An error if the context does not exist.
   */
  get() {
    const context = getContext(this.#key);
    if (context === void 0) {
      throw new Error(`Context "${this.#name}" not found`);
    }
    return context;
  }
  /**
   * Retrieves the context that belongs to the closest parent component,
   * or the given fallback value if the context does not exist.
   *
   * Must be called during component initialisation.
   */
  getOr(fallback) {
    const context = getContext(this.#key);
    if (context === void 0) {
      return fallback;
    }
    return context;
  }
  /**
   * Associates the given value with the current component and returns it.
   *
   * Must be called during component initialisation.
   */
  set(context) {
    return setContext(this.#key, context);
  }
}
const sonnerContext = new Context("<Toaster/>");
let toastsCounter = 0;
function getToastId(data) {
  return typeof data?.id === "number" || typeof data?.id === "string" && data.id.length > 0 ? data.id : toastsCounter++;
}
class ToastState {
  toasts = [];
  heights = [];
  // Removals whose exit animation is running but whose entry hasn't been removed yet
  #pendingRemovals = /* @__PURE__ */ new Map();
  #findToastIdx = (id) => {
    const idx = this.toasts.findIndex((toast) => toast.id === id);
    if (idx === -1) return null;
    return idx;
  };
  #findHeightIdx = (toastId) => this.heights.findIndex((height) => height.toastId === toastId);
  addToast = (data) => {
    if (!isBrowser) return;
    this.toasts.unshift(data);
  };
  updateToast = ({ id, data, type, message }) => {
    const toastIdx = this.toasts.findIndex((toast) => toast.id === id);
    const toastToUpdate = this.toasts[toastIdx];
    this.toasts[toastIdx] = {
      ...toastToUpdate,
      ...data,
      id,
      title: message,
      type,
      // A dismissal that hasn't been processed yet gets cancelled: the toast is
      // still on screen, so this is an update of it rather than a new toast.
      dismiss: false,
      delete: false,
      updated: true
    };
  };
  // Flags a toast that was dismissed from inside the Toast component (close button,
  // swipe, action/cancel click, auto-close) so `create` treats an id reuse as a new
  // toast instead of merging the old props into it.
  markDismissed = (id) => {
    const toastIdx = this.#findToastIdx(id);
    if (toastIdx === null) return;
    const toast = this.toasts[toastIdx];
    if (!toast) return;
    if (!toast.dismiss || !toast.delete) {
      this.toasts[toastIdx] = { ...toast, dismiss: true, delete: true };
    }
  };
  scheduleRemoval = (id, delay) => {
    this.cancelRemoval(id);
    this.#pendingRemovals.set(id, setTimeout(
      () => {
        this.#pendingRemovals.delete(id);
        this.remove(id);
      },
      delay
    ));
  };
  cancelRemoval = (id) => {
    const timeout = this.#pendingRemovals.get(id);
    if (timeout !== void 0) {
      clearTimeout(timeout);
      this.#pendingRemovals.delete(id);
    }
  };
  create = (data) => {
    const { message, ...rest } = data;
    const id = getToastId(data);
    const dismissible = data.dismissible !== void 0 ? data.dismissible : data.dismissable !== void 0 ? data.dismissable : true;
    const type = data.type === void 0 ? "default" : data.type;
    run(() => {
      this.cancelRemoval(id);
      const alreadyExists = this.toasts.find((toast) => toast.id === id);
      if (alreadyExists?.dismiss || alreadyExists?.delete) {
        this.remove(id);
        this.addToast({
          ...rest,
          id,
          title: message,
          dismissible,
          type,
          updated: true
        });
      } else if (alreadyExists) {
        this.updateToast({ id, data, type, message, dismissible });
      } else {
        this.addToast({ ...rest, id, title: message, dismissible, type });
      }
    });
    return id;
  };
  dismiss = (id) => {
    run(() => {
      if (id === void 0) {
        this.toasts = this.toasts.map((toast) => toast.dismiss ? toast : { ...toast, dismiss: true });
        return;
      }
      const toastIdx = this.toasts.findIndex((toast) => toast.id === id);
      if (this.toasts[toastIdx]) {
        this.toasts[toastIdx] = { ...this.toasts[toastIdx], dismiss: true };
      }
    });
    return id;
  };
  remove = (id) => {
    if (id === void 0) {
      this.toasts = [];
      return;
    }
    const toastIdx = this.#findToastIdx(id);
    if (toastIdx === null) return;
    this.toasts.splice(toastIdx, 1);
    return id;
  };
  message = (message, data) => {
    return this.create({ ...data, type: "default", message });
  };
  error = (message, data) => {
    return this.create({ ...data, type: "error", message });
  };
  success = (message, data) => {
    return this.create({ ...data, type: "success", message });
  };
  info = (message, data) => {
    return this.create({ ...data, type: "info", message });
  };
  warning = (message, data) => {
    return this.create({ ...data, type: "warning", message });
  };
  loading = (message, data) => {
    return this.create({ ...data, type: "loading", message });
  };
  promise = (promise, data) => {
    if (!data) {
      return;
    }
    let id = void 0;
    if (data.loading !== void 0) {
      id = this.create({
        ...data,
        promise,
        type: "loading",
        message: typeof data.loading === "string" ? data.loading : data.loading()
      });
    }
    const p = promise instanceof Promise ? promise : promise();
    let shouldDismiss = id !== void 0;
    p.then((response) => {
      if (typeof response === "object" && response && "ok" in response && typeof response.ok === "boolean" && !response.ok) {
        shouldDismiss = false;
        const message = constructPromiseErrorMessage(response);
        this.create({ id, type: "error", message });
      } else if (data.success !== void 0) {
        shouldDismiss = false;
        const message = typeof data.success === "function" ? data.success(response) : data.success;
        this.create({ id, type: "success", message });
      }
    }).catch((error) => {
      if (data.error !== void 0) {
        shouldDismiss = false;
        const message = typeof data.error === "function" ? data.error(error) : data.error;
        this.create({ id, type: "error", message });
      }
    }).finally(() => {
      if (shouldDismiss) {
        this.dismiss(id);
        id = void 0;
      }
      data.finally?.();
    });
    return id;
  };
  custom = (component, data) => {
    const id = getToastId(data);
    this.create({ component, ...data, id });
    return id;
  };
  removeHeight = (id) => {
    this.heights = this.heights.filter((height) => height.toastId !== id);
  };
  setHeight = (data) => {
    run(() => {
      const heightIdx = this.#findHeightIdx(data.toastId);
      if (heightIdx !== -1) {
        this.heights[heightIdx] = data;
        return;
      }
      const order = new Map(this.toasts.map((toast, idx) => [toast.id, idx]));
      const toastOrder = order.get(data.toastId) ?? -1;
      const insertIdx = this.heights.findIndex((height) => (order.get(height.toastId) ?? Infinity) > toastOrder);
      if (insertIdx === -1) {
        this.heights.push(data);
      } else {
        this.heights.splice(insertIdx, 0, data);
      }
    });
  };
  reset = () => {
    this.toasts = [];
    this.heights = [];
    this.#pendingRemovals.forEach((timeout) => clearTimeout(timeout));
    this.#pendingRemovals.clear();
  };
}
function constructPromiseErrorMessage(response) {
  if (response && typeof response === "object" && "status" in response) {
    return `HTTP error! Status: ${response.status}`;
  }
  return `Error! ${response}`;
}
const toastState = new ToastState();
function toastFunction(message, data) {
  return toastState.message(message, data);
}
class SonnerState {
  /**
   * A derived state of the toasts that are not dismissed.
   */
  #activeToasts = derived(() => toastState.toasts.filter((toast) => !toast.dismiss));
  get toasts() {
    return this.#activeToasts();
  }
}
const basicToast = toastFunction;
Object.assign(basicToast, {
  success: toastState.success,
  info: toastState.info,
  warning: toastState.warning,
  error: toastState.error,
  custom: toastState.custom,
  message: toastState.message,
  promise: toastState.promise,
  dismiss: toastState.dismiss,
  loading: toastState.loading,
  getActiveToasts: () => {
    return toastState.toasts.filter((toast) => !toast.dismiss);
  }
});
function isAction(action) {
  return action.label !== void 0;
}
const TOAST_LIFETIME$1 = 4e3;
const GAP$1 = 14;
const TIME_BEFORE_UNMOUNT = 200;
const DEFAULT_TOAST_CLASSES = {
  toast: "",
  title: "",
  description: "",
  loader: "",
  closeButton: "",
  cancelButton: "",
  actionButton: "",
  action: "",
  warning: "",
  error: "",
  success: "",
  default: "",
  info: "",
  loading: ""
};
function Toast($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      toast,
      index,
      expanded,
      invert: invertFromToaster,
      position,
      visibleToasts,
      expandByDefault,
      closeButton: closeButtonFromToaster,
      interacting,
      cancelButtonStyle = "",
      actionButtonStyle = "",
      duration: durationFromToaster,
      descriptionClass = "",
      classes: classesProp,
      unstyled = false,
      loadingIcon,
      successIcon,
      errorIcon,
      warningIcon,
      closeIcon,
      infoIcon,
      defaultRichColors = false,
      gap = GAP$1,
      swipeDirections: swipeDirectionsProp,
      closeButtonAriaLabel,
      pauseWhenPageIsHidden,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const defaultClasses = { ...DEFAULT_TOAST_CLASSES };
    let mounted = false;
    let removed = false;
    let swiping = false;
    let swipeOut = false;
    let isSwiped = false;
    let offsetBeforeRemove = 0;
    let initialHeight = 0;
    toast.duration || durationFromToaster || TOAST_LIFETIME$1;
    let swipeOutDirection = null;
    const isFront = derived(() => index === 0);
    const isVisible = derived(() => index + 1 <= visibleToasts);
    const toastType = derived(() => toast.type);
    const dismissible = derived(() => toast.dismissible !== void 0 ? toast.dismissible !== false : toast.dismissable !== false);
    const toastClass = derived(() => toast.class || "");
    const toastDescriptionClass = derived(() => toast.descriptionClass || "");
    const relevantHeights = derived(() => toastState.heights.filter((height) => height.toasterId === toast.toasterId && height.position === position));
    const heightIndex = derived(() => {
      const idx = relevantHeights().findIndex((height) => height.toastId === toast.id);
      return idx === -1 ? 0 : idx;
    });
    const closeButton = derived(() => toast.closeButton ?? closeButtonFromToaster);
    const coords = derived(() => position.split("-"));
    const toastsHeightBefore = derived(() => relevantHeights().reduce(
      (prev, curr, reducerIndex) => {
        if (reducerIndex >= heightIndex()) return prev;
        return prev + curr.height;
      },
      0
    ));
    const invert = derived(() => toast.invert || invertFromToaster);
    const disabled = derived(() => toastType() === "loading");
    const classes = derived(() => ({ ...defaultClasses, ...classesProp }));
    const offset = derived(() => Math.round(heightIndex() * gap + toastsHeightBefore()));
    function deleteToast() {
      removed = true;
      offsetBeforeRemove = offset();
      toastState.removeHeight(toast.id);
      toastState.markDismissed(toast.id);
      toastState.scheduleRemoval(toast.id, TIME_BEFORE_UNMOUNT);
    }
    const icon = derived(() => {
      if (toast.icon) return toast.icon;
      if (toastType() === "success") return successIcon;
      if (toastType() === "error") return errorIcon;
      if (toastType() === "warning") return warningIcon;
      if (toastType() === "info") return infoIcon;
      if (toastType() === "loading") return loadingIcon;
      return null;
    });
    function LoadingIcon($$renderer3) {
      if (loadingIcon) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div${attr_class(clsx(cn(classes()?.loader, toast?.classes?.loader, "sonner-loader")))}${attr("data-visible", toastType() === "loading")}>`);
        loadingIcon($$renderer3);
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        Loader($$renderer3, {
          class: cn(classes()?.loader, toast.classes?.loader),
          visible: toastType() === "loading"
        });
      }
      $$renderer3.push(`<!--]-->`);
    }
    $$renderer2.push(`<li${attr("tabindex", 0)}${attr_class(clsx(cn(restProps.class, toastClass(), classes()?.toast, toast?.classes?.toast, classes()?.[toastType()], toast?.classes?.[toastType()])))}${attr("aria-live", toast.important ? "assertive" : "polite")} aria-atomic="true" data-sonner-toast=""${attr("data-rich-colors", toast.richColors ?? defaultRichColors)}${attr("data-styled", !(toast.component || toast.unstyled || unstyled))}${attr("data-mounted", mounted)}${attr("data-promise", Boolean(toast.promise))}${attr("data-swiped", isSwiped)}${attr("data-removed", removed)}${attr("data-visible", isVisible())}${attr("data-y-position", coords()[0])}${attr("data-x-position", coords()[1])}${attr("data-index", index)}${attr("data-front", isFront())}${attr("data-swiping", swiping)}${attr("data-dismissible", dismissible())}${attr("data-type", toastType())}${attr("data-invert", invert())}${attr("data-swipe-out", swipeOut)}${attr("data-swipe-direction", swipeOutDirection)}${attr("data-expanded", Boolean(expanded || expandByDefault && mounted))}${attr_style(`${restProps.style} ${toast.style}`, {
      "--index": index,
      "--toasts-before": index,
      "--z-index": toastState.toasts.length - index,
      "--offset": `${removed ? offsetBeforeRemove : offset()}px`,
      "--initial-height": expandByDefault ? "auto" : `${initialHeight}px`
    })}>`);
    if (closeButton() && !toast.component && toastType() !== "loading" && closeIcon !== null) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button${attr("aria-label", closeButtonAriaLabel)}${attr("data-disabled", disabled())} data-close-button=""${attr_class(clsx(cn(classes()?.closeButton, toast?.classes?.closeButton)))}>`);
      closeIcon?.($$renderer2);
      $$renderer2.push(`<!----></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (toast.component) {
      $$renderer2.push("<!--[0-->");
      const Component = toast.component;
      if (Component) {
        $$renderer2.push("<!--[-->");
        Component($$renderer2, spread_props([toast.componentProps, { closeToast: deleteToast }]));
        $$renderer2.push("<!--]-->");
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push("<!--]-->");
      }
    } else {
      $$renderer2.push("<!--[-1-->");
      if ((toastType() || toast.icon || toast.promise) && toast.icon !== null && (icon() !== null || toast.icon)) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div data-icon=""${attr_class(clsx(cn(classes()?.icon, toast?.classes?.icon)))}>`);
        if (toastType() === "loading") {
          $$renderer2.push("<!--[0-->");
          if (toast.icon) {
            $$renderer2.push("<!--[0-->");
            if (toast.icon) {
              $$renderer2.push("<!--[-->");
              toast.icon($$renderer2, {});
              $$renderer2.push("<!--]-->");
            } else {
              $$renderer2.push("<!--[!-->");
              $$renderer2.push("<!--]-->");
            }
          } else {
            $$renderer2.push("<!--[-1-->");
            LoadingIcon($$renderer2);
          }
          $$renderer2.push(`<!--]-->`);
        } else if (toast.promise) {
          $$renderer2.push("<!--[1-->");
          LoadingIcon($$renderer2);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (toastType() !== "loading") {
          $$renderer2.push("<!--[0-->");
          if (toast.icon) {
            $$renderer2.push("<!--[0-->");
            if (toast.icon) {
              $$renderer2.push("<!--[-->");
              toast.icon($$renderer2, {});
              $$renderer2.push("<!--]-->");
            } else {
              $$renderer2.push("<!--[!-->");
              $$renderer2.push("<!--]-->");
            }
          } else if (toastType() === "success") {
            $$renderer2.push("<!--[1-->");
            successIcon?.($$renderer2);
            $$renderer2.push(`<!---->`);
          } else if (toastType() === "error") {
            $$renderer2.push("<!--[2-->");
            errorIcon?.($$renderer2);
            $$renderer2.push(`<!---->`);
          } else if (toastType() === "warning") {
            $$renderer2.push("<!--[3-->");
            warningIcon?.($$renderer2);
            $$renderer2.push(`<!---->`);
          } else if (toastType() === "info") {
            $$renderer2.push("<!--[4-->");
            infoIcon?.($$renderer2);
            $$renderer2.push(`<!---->`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div data-content=""${attr_class(clsx(cn(classes()?.content, toast?.classes?.content)))}><div data-title=""${attr_class(clsx(cn(classes()?.title, toast?.classes?.title)))}>`);
      if (toast.title) {
        $$renderer2.push("<!--[0-->");
        if (typeof toast.title !== "string") {
          $$renderer2.push("<!--[0-->");
          const Title = toast.title;
          if (Title) {
            $$renderer2.push("<!--[-->");
            Title($$renderer2, spread_props([toast.componentProps]));
            $$renderer2.push("<!--]-->");
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push("<!--]-->");
          }
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`${escape_html(toast.title)}`);
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (toast.description) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div data-description=""${attr_class(clsx(cn(descriptionClass, toastDescriptionClass(), classes()?.description, toast.classes?.description)))}>`);
        if (typeof toast.description !== "string") {
          $$renderer2.push("<!--[0-->");
          const Description = toast.description;
          if (Description) {
            $$renderer2.push("<!--[-->");
            Description($$renderer2, spread_props([toast.componentProps]));
            $$renderer2.push("<!--]-->");
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push("<!--]-->");
          }
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`${escape_html(toast.description)}`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (toast.cancel) {
        $$renderer2.push("<!--[0-->");
        if (typeof toast.cancel === "function") {
          $$renderer2.push("<!--[0-->");
          if (toast.cancel) {
            $$renderer2.push("<!--[-->");
            toast.cancel($$renderer2, {});
            $$renderer2.push("<!--]-->");
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push("<!--]-->");
          }
        } else if (isAction(toast.cancel)) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<button data-button="" data-cancel=""${attr_style(toast.cancelButtonStyle ?? cancelButtonStyle)}${attr_class(clsx(cn(classes()?.cancelButton, toast?.classes?.cancelButton)))}>${escape_html(toast.cancel.label)}</button>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (toast.action) {
        $$renderer2.push("<!--[0-->");
        if (typeof toast.action === "function") {
          $$renderer2.push("<!--[0-->");
          if (toast.action) {
            $$renderer2.push("<!--[-->");
            toast.action($$renderer2, {});
            $$renderer2.push("<!--]-->");
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push("<!--]-->");
          }
        } else if (isAction(toast.action)) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<button data-button=""${attr_style(toast.actionButtonStyle ?? actionButtonStyle)}${attr_class(clsx(cn(classes()?.actionButton, toast?.classes?.actionButton)))}>${escape_html(toast.action.label)}</button>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></li>`);
  });
}
function SuccessIcon($$renderer) {
  $$renderer.push(`<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20" data-sonner-success-icon=""><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"></path></svg>`);
}
function ErrorIcon($$renderer) {
  $$renderer.push(`<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20" data-sonner-error-icon=""><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>`);
}
function WarningIcon($$renderer) {
  $$renderer.push(`<svg aria-hidden="true" viewBox="0 0 64 64" fill="currentColor" height="20" width="20" data-sonner-warning-icon="" xmlns="http://www.w3.org/2000/svg"><path d="M32.427,7.987c2.183,0.124 4,1.165 5.096,3.281l17.936,36.208c1.739,3.66 -0.954,8.585 -5.373,8.656l-36.119,0c-4.022,-0.064 -7.322,-4.631 -5.352,-8.696l18.271,-36.207c0.342,-0.65 0.498,-0.838 0.793,-1.179c1.186,-1.375 2.483,-2.111 4.748,-2.063Zm-0.295,3.997c-0.687,0.034 -1.316,0.419 -1.659,1.017c-6.312,11.979 -12.397,24.081 -18.301,36.267c-0.546,1.225 0.391,2.797 1.762,2.863c12.06,0.195 24.125,0.195 36.185,0c1.325,-0.064 2.321,-1.584 1.769,-2.85c-5.793,-12.184 -11.765,-24.286 -17.966,-36.267c-0.366,-0.651 -0.903,-1.042 -1.79,-1.03Z"></path><path d="M33.631,40.581l-3.348,0l-0.368,-16.449l4.1,0l-0.384,16.449Zm-3.828,5.03c0,-0.609 0.197,-1.113 0.592,-1.514c0.396,-0.4 0.935,-0.601 1.618,-0.601c0.684,0 1.223,0.201 1.618,0.601c0.395,0.401 0.593,0.905 0.593,1.514c0,0.587 -0.193,1.078 -0.577,1.473c-0.385,0.395 -0.929,0.593 -1.634,0.593c-0.705,0 -1.249,-0.198 -1.634,-0.593c-0.384,-0.395 -0.576,-0.886 -0.576,-1.473Z"></path></svg>`);
}
function InfoIcon($$renderer) {
  $$renderer.push(`<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20" data-sonner-info-icon=""><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"></path></svg>`);
}
function CloseIcon($$renderer) {
  $$renderer.push(`<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-sonner-close-icon=""><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`);
}
const VISIBLE_TOASTS_AMOUNT = 3;
const VIEWPORT_OFFSET = "24px";
const MOBILE_VIEWPORT_OFFSET = "16px";
const TOAST_LIFETIME = 4e3;
const TOAST_WIDTH = 356;
const GAP = 14;
const DARK = "dark";
const LIGHT = "light";
function getOffsetObject(defaultOffset, mobileOffset) {
  const styles = {};
  [defaultOffset, mobileOffset].forEach((offset, index) => {
    const isMobile = index === 1;
    const prefix = isMobile ? "--mobile-offset" : "--offset";
    const defaultValue = isMobile ? MOBILE_VIEWPORT_OFFSET : VIEWPORT_OFFSET;
    function assignAll(offset2) {
      ["top", "right", "bottom", "left"].forEach((key) => {
        styles[`${prefix}-${key}`] = typeof offset2 === "number" ? `${offset2}px` : offset2;
      });
    }
    if (typeof offset === "number" || typeof offset === "string") {
      assignAll(offset);
    } else if (typeof offset === "object") {
      ["top", "right", "bottom", "left"].forEach((key) => {
        const value = offset[key];
        if (value === void 0) {
          styles[`${prefix}-${key}`] = defaultValue;
        } else {
          styles[`${prefix}-${key}`] = typeof value === "number" ? `${value}px` : value;
        }
      });
    } else {
      assignAll(defaultValue);
    }
  });
  return styles;
}
function Toaster($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    function getInitialTheme(t) {
      if (t !== "system") return t;
      if (typeof window !== "undefined") {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          return DARK;
        }
        return LIGHT;
      }
      return LIGHT;
    }
    let {
      id,
      invert = false,
      position = "bottom-right",
      hotkey = ["altKey", "KeyT"],
      expand = false,
      closeButton = false,
      offset = VIEWPORT_OFFSET,
      mobileOffset = MOBILE_VIEWPORT_OFFSET,
      theme = "light",
      richColors = false,
      duration = TOAST_LIFETIME,
      visibleToasts = VISIBLE_TOASTS_AMOUNT,
      toastOptions = {},
      dir = "auto",
      gap = GAP,
      swipeDirections,
      pauseWhenPageIsHidden = false,
      loadingIcon: loadingIconProp,
      successIcon: successIconProp,
      errorIcon: errorIconProp,
      warningIcon: warningIconProp,
      closeIcon: closeIconProp,
      infoIcon: infoIconProp,
      containerAriaLabel = "Notifications",
      class: className,
      closeButtonAriaLabel = "Close toast",
      onblur,
      onfocus,
      onmouseenter,
      onmousemove,
      onmouseleave,
      ondragend,
      onpointerdown,
      onpointerup,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    function getDocumentDirection() {
      if (dir !== "auto") return dir;
      if (typeof window === "undefined") return "ltr";
      if (typeof document === "undefined") return "ltr";
      const dirAttribute = document.documentElement.getAttribute("dir");
      if (dirAttribute === "auto" || !dirAttribute) {
        run(() => dir = window.getComputedStyle(document.documentElement).direction ?? "ltr");
        return dir;
      }
      run(() => dir = dirAttribute);
      return dirAttribute;
    }
    const filteredToasts = derived(() => id ? toastState.toasts.filter((toast) => toast.toasterId === id) : toastState.toasts.filter((toast) => !toast.toasterId));
    const possiblePositions = derived(() => Array.from(new Set([
      position,
      ...filteredToasts().filter((toast) => toast.position).map((toast) => toast.position)
    ].filter(Boolean))));
    let expanded = false;
    let interacting = false;
    let actualTheme = getInitialTheme(theme);
    const hotkeyLabel = derived(() => hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, ""));
    sonnerContext.set(new SonnerState());
    $$renderer2.push(`<section${attr("aria-label", `${stringify(containerAriaLabel)} ${stringify(hotkeyLabel())}`)}${attr("tabindex", -1)} aria-live="polite" aria-relevant="additions text" aria-atomic="false">`);
    if (filteredToasts().length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(possiblePositions());
      for (let index = 0, $$length = each_array.length; index < $$length; index++) {
        let position2 = each_array[index];
        const [y, x] = position2.split("-");
        const offsetObject = getOffsetObject(offset, mobileOffset);
        const frontHeight = toastState.heights.find((height) => height.toasterId === id && height.position === position2)?.height ?? 0;
        $$renderer2.push(`<ol${attributes(
          {
            tabindex: -1,
            dir: getDocumentDirection(),
            class: clsx(className),
            "data-sonner-toaster": true,
            "data-sonner-theme": actualTheme,
            "data-y-position": y,
            "data-x-position": x,
            style: restProps.style,
            ...restProps
          },
          void 0,
          void 0,
          {
            "--front-toast-height": `${frontHeight}px`,
            "--width": `${TOAST_WIDTH}px`,
            "--gap": `${gap}px`,
            "--offset-top": offsetObject["--offset-top"],
            "--offset-right": offsetObject["--offset-right"],
            "--offset-bottom": offsetObject["--offset-bottom"],
            "--offset-left": offsetObject["--offset-left"],
            "--mobile-offset-top": offsetObject["--mobile-offset-top"],
            "--mobile-offset-right": offsetObject["--mobile-offset-right"],
            "--mobile-offset-bottom": offsetObject["--mobile-offset-bottom"],
            "--mobile-offset-left": offsetObject["--mobile-offset-left"]
          }
        )}><!--[-->`);
        const each_array_1 = ensure_array_like(filteredToasts().filter((toast) => !toast.position && index === 0 || toast.position === position2));
        for (let index2 = 0, $$length2 = each_array_1.length; index2 < $$length2; index2++) {
          let toast = each_array_1[index2];
          {
            let successIcon = function($$renderer3) {
              if (successIconProp) {
                $$renderer3.push("<!--[0-->");
                successIconProp?.($$renderer3);
                $$renderer3.push(`<!---->`);
              } else if (successIconProp !== null) {
                $$renderer3.push("<!--[1-->");
                SuccessIcon($$renderer3);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]-->`);
            }, errorIcon = function($$renderer3) {
              if (errorIconProp) {
                $$renderer3.push("<!--[0-->");
                errorIconProp?.($$renderer3);
                $$renderer3.push(`<!---->`);
              } else if (errorIconProp !== null) {
                $$renderer3.push("<!--[1-->");
                ErrorIcon($$renderer3);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]-->`);
            }, warningIcon = function($$renderer3) {
              if (warningIconProp) {
                $$renderer3.push("<!--[0-->");
                warningIconProp?.($$renderer3);
                $$renderer3.push(`<!---->`);
              } else if (warningIconProp !== null) {
                $$renderer3.push("<!--[1-->");
                WarningIcon($$renderer3);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]-->`);
            }, infoIcon = function($$renderer3) {
              if (infoIconProp) {
                $$renderer3.push("<!--[0-->");
                infoIconProp?.($$renderer3);
                $$renderer3.push(`<!---->`);
              } else if (infoIconProp !== null) {
                $$renderer3.push("<!--[1-->");
                InfoIcon($$renderer3);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]-->`);
            }, closeIcon = function($$renderer3) {
              if (closeIconProp) {
                $$renderer3.push("<!--[0-->");
                closeIconProp?.($$renderer3);
                $$renderer3.push(`<!---->`);
              } else if (closeIconProp !== null) {
                $$renderer3.push("<!--[1-->");
                CloseIcon($$renderer3);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]-->`);
            };
            Toast($$renderer2, {
              index: index2,
              toast,
              defaultRichColors: richColors,
              duration: toastOptions?.duration ?? duration,
              class: toastOptions?.class ?? "",
              descriptionClass: toastOptions?.descriptionClass || "",
              invert,
              visibleToasts,
              closeButton: toastOptions?.closeButton ?? closeButton,
              interacting,
              position: position2,
              gap,
              style: toastOptions?.style ?? "",
              classes: toastOptions.classes || {},
              unstyled: toastOptions.unstyled ?? false,
              cancelButtonStyle: toastOptions?.cancelButtonStyle ?? "",
              actionButtonStyle: toastOptions?.actionButtonStyle ?? "",
              closeButtonAriaLabel: toastOptions?.closeButtonAriaLabel ?? closeButtonAriaLabel,
              expandByDefault: expand,
              expanded,
              swipeDirections,
              pauseWhenPageIsHidden,
              loadingIcon: loadingIconProp,
              successIcon,
              errorIcon,
              warningIcon,
              infoIcon,
              closeIcon,
              $$slots: {
                successIcon: true,
                errorIcon: true,
                warningIcon: true,
                infoIcon: true,
                closeIcon: true
              }
            });
          }
        }
        $$renderer2.push(`<!--]--></ol>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></section>`);
  });
}
function MiniPlayer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const visible = derived(() => player.playingG >= 1 && !page.url.pathname.startsWith("/mushaf"));
    const label = derived(() => {
      if (player.playingG < 1) return "";
      const { s, a } = gToSA(player.playingG);
      return `${SURAHS[s - 1].name_translit} · ${s}:${a}`;
    });
    if (visible()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-x-0 z-40 flex justify-center px-4" style="bottom: calc(64px + var(--safe-b));"><button class="flex w-full max-w-[420px] items-center gap-3 rounded-2xl border border-gold-soft bg-card px-4 py-2.5 shadow-lg"><span class="relative flex h-2.5 w-2.5"><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60"></span> <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary"></span></span> <span class="flex-1 truncate text-left text-sm font-medium">${escape_html(label())}</span> <span role="button" tabindex="0" class="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground hover:text-destructive">`);
      Square($$renderer2, { size: 16, fill: "currentColor" });
      $$renderer2.push(`<!----></span></button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const currentPage = derived(() => Number(page.url.searchParams.get("page") || settings.value.page || 1));
    head("1ktlqb3", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Mushaf Digital — Cakna</title>`);
      });
    });
    Toaster($$renderer2, { richColors: true, position: "top-center" });
    $$renderer2.push(`<!----> <div class="mushaf-root svelte-1ktlqb3"${attr_style(`--arabic-size: ${stringify(settings.value.fontSize)}px;`)}><header class="mushaf-header svelte-1ktlqb3"><a href="https://cakna.org/hub" class="back-btn svelte-1ktlqb3">`);
    Chevron_left($$renderer2, { size: 20 });
    $$renderer2.push(`<!----></a> <div class="header-center svelte-1ktlqb3">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span class="page-label svelte-1ktlqb3">Mushaf Digital</span>`);
    }
    $$renderer2.push(`<!--]--></div> <button class="icon-btn svelte-1ktlqb3" aria-label="Tetapan">`);
    Settings($$renderer2, { size: 18 });
    $$renderer2.push(`<!----></button></header> <main class="mushaf-main svelte-1ktlqb3">`);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="state-box svelte-1ktlqb3"><div class="spinner svelte-1ktlqb3"></div> <p class="mt-3 text-sm text-white/40">Memuatkan halaman ${escape_html(currentPage())}…</p></div>`);
    }
    $$renderer2.push(`<!--]--></main> <nav class="page-nav svelte-1ktlqb3"><button class="nav-btn svelte-1ktlqb3"${attr("disabled", currentPage() >= TOTAL_PAGES, true)} aria-label="Halaman sebelumnya">`);
    Chevron_right($$renderer2, { size: 20 });
    $$renderer2.push(`<!----></button> <span class="nav-label svelte-1ktlqb3">${escape_html(currentPage())} / ${escape_html(TOTAL_PAGES)}</span> <button class="nav-btn svelte-1ktlqb3"${attr("disabled", currentPage() <= 1, true)} aria-label="Halaman seterusnya">`);
    Chevron_left($$renderer2, { size: 20 });
    $$renderer2.push(`<!----></button></nav> `);
    SideNav($$renderer2, { active: "mushaf" });
    $$renderer2.push(`<!----> `);
    MiniPlayer($$renderer2);
    $$renderer2.push(`<!----> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
