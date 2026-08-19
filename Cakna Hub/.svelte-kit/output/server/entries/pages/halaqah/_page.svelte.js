import { s as sanitize_props, a as spread_props, c as slot, j as attr_style, k as stringify, i as head, e as escape_html, d as ensure_array_like, f as attr_class, g as attr, h as derived } from "../../../chunks/index.js";
import { p as page } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import "clsx";
import { Room, RoomEvent, Track } from "livekit-client";
import { R as Radio, S as SideNav } from "../../../chunks/SideNav.js";
import { C as Chevron_left } from "../../../chunks/chevron-left.js";
import { L as Log_out } from "../../../chunks/log-out.js";
import { U as Users } from "../../../chunks/users.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { C as Copy } from "../../../chunks/copy.js";
import { X } from "../../../chunks/x.js";
import { B as Book_open } from "../../../chunks/book-open.js";
import { M as Map_pin } from "../../../chunks/map-pin.js";
function Mic($$renderer, $$props) {
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
      "path",
      { "d": "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" }
    ],
    ["path", { "d": "M19 10v2a7 7 0 0 1-14 0v-2" }],
    ["line", { "x1": "12", "x2": "12", "y1": "19", "y2": "22" }]
  ];
  Icon($$renderer, spread_props([
    { name: "mic" },
    $$sanitized_props,
    {
      /**
       * @component @name Mic
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMmEzIDMgMCAwIDAtMyAzdjdhMyAzIDAgMCAwIDYgMFY1YTMgMyAwIDAgMC0zLTNaIiAvPgogIDxwYXRoIGQ9Ik0xOSAxMHYyYTcgNyAwIDAgMS0xNCAwdi0yIiAvPgogIDxsaW5lIHgxPSIxMiIgeDI9IjEyIiB5MT0iMTkiIHkyPSIyMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/mic
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
function Mic_off($$renderer, $$props) {
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
    ["line", { "x1": "2", "x2": "22", "y1": "2", "y2": "22" }],
    ["path", { "d": "M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" }],
    ["path", { "d": "M5 10v2a7 7 0 0 0 12 5" }],
    ["path", { "d": "M15 9.34V5a3 3 0 0 0-5.68-1.33" }],
    ["path", { "d": "M9 9v3a3 3 0 0 0 5.12 2.12" }],
    ["line", { "x1": "12", "x2": "12", "y1": "19", "y2": "22" }]
  ];
  Icon($$renderer, spread_props([
    { name: "mic-off" },
    $$sanitized_props,
    {
      /**
       * @component @name MicOff
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iMiIgeDI9IjIyIiB5MT0iMiIgeTI9IjIyIiAvPgogIDxwYXRoIGQ9Ik0xOC44OSAxMy4yM0E3LjEyIDcuMTIgMCAwIDAgMTkgMTJ2LTIiIC8+CiAgPHBhdGggZD0iTTUgMTB2MmE3IDcgMCAwIDAgMTIgNSIgLz4KICA8cGF0aCBkPSJNMTUgOS4zNFY1YTMgMyAwIDAgMC01LjY4LTEuMzMiIC8+CiAgPHBhdGggZD0iTTkgOXYzYTMgMyAwIDAgMCA1LjEyIDIuMTIiIC8+CiAgPGxpbmUgeDE9IjEyIiB4Mj0iMTIiIHkxPSIxOSIgeTI9IjIyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/mic-off
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
function Scroll_text($$renderer, $$props) {
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
    ["path", { "d": "M15 12h-5" }],
    ["path", { "d": "M15 8h-5" }],
    ["path", { "d": "M19 17V5a2 2 0 0 0-2-2H4" }],
    [
      "path",
      {
        "d": "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "scroll-text" },
    $$sanitized_props,
    {
      /**
       * @component @name ScrollText
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMTJoLTUiIC8+CiAgPHBhdGggZD0iTTE1IDhoLTUiIC8+CiAgPHBhdGggZD0iTTE5IDE3VjVhMiAyIDAgMCAwLTItMkg0IiAvPgogIDxwYXRoIGQ9Ik04IDIxaDEyYTIgMiAwIDAgMCAyLTJ2LTFhMSAxIDAgMCAwLTEtMUgxMWExIDEgMCAwIDAtMSAxdjFhMiAyIDAgMSAxLTQgMFY1YTIgMiAwIDEgMC00IDB2MmExIDEgMCAwIDAgMSAxaDMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/scroll-text
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
function AudioVisualizer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { height = 96 } = $$props;
    $$renderer2.push(`<canvas class="viz svelte-z7i51c"${attr_style(`height:${stringify(
      // Cache the 2D context and the spectrum buffer once — not per frame.
      // The accent colour is a CSS custom property, so reading it needs
      // getComputedStyle — which forces a style recalc. Doing that every frame
      // (~60×/s) was the visualiser's biggest cost, felt most on mobile. Cache
      // it and refresh only ~twice a second, which is plenty to pick up a
      // light/dark theme toggle. Switching accent↔idle on `live` stays instant.
      // Sample the lower ~2/3 of the spectrum; the top octaves are mostly
      // empty for speech and would leave the right-hand bars dead.
      // Ease toward the target so bars glide rather than jump.
      // rounded caps read better than hard rectangles at this size
      height
    )}px`)} aria-hidden="true"></canvas>`);
  });
}
class HalaqahSession {
  room = null;
  members = [];
  role = "listener";
  speakerId = null;
  /** The page the reciter is on — the shared state everyone follows. */
  page = 1;
  /**
   * Whether this client's view tracks the reciter. Participants may browse away
   * to check something; forcing their screen to jump would be disorienting, so
   * they unfollow implicitly and can snap back on demand.
   */
  following = true;
  /** Page this client is actually looking at (equals `page` while following). */
  viewPage = 1;
  /**
   * What the mic-holder is showing the room, or null when they have stopped.
   * `page` renders inline; `route` points at another part of the app that
   * participants can follow into.
   */
  share = null;
  /** Am I the one broadcasting? On by default for whoever holds the floor. */
  sharing = true;
  /** Local dismissal — hides the shared panel for me only, without stopping it. */
  panelHidden = false;
  /** The track we visualise: whoever currently holds the floor. */
  floorTrack = null;
  micOn = false;
  connected = false;
  error = null;
  title = "";
  slug = "";
  selfId = "";
  /**
   * Per-participant engagement (from heartbeats), keyed by identity. The host
   * reads this to see who is following along. See sendHeartbeat / receiveHeartbeat.
   */
  engagement = {};
  hbTimer = null;
  lastSampleAt = 0;
  myAttentiveMs = 0;
  mySessionMs = 0;
  visible = true;
  /** True when this client is allowed to publish audio at all. */
  get canSpeak() {
    return this.role === "host" || this.role === "speaker";
  }
  async connect(info) {
    this.role = info.role;
    this.speakerId = info.speaker_id;
    this.title = info.room.title;
    this.slug = info.room.slug;
    this.selfId = info.identity;
    this.page = info.page ?? 1;
    this.viewPage = this.page;
    this.share = info.share ?? { kind: "page", page: this.page };
    const room = new Room({ adaptiveStream: true, dynacast: true });
    this.room = room;
    room.on(RoomEvent.ParticipantConnected, () => this.sync()).on(RoomEvent.ParticipantDisconnected, (p) => {
      delete this.engagement[p.identity];
      this.sync();
    }).on(RoomEvent.TrackSubscribed, (t) => {
      if (t.kind === Track.Kind.Audio) {
        this.playRemote(t);
        this.pickFloorTrack();
      }
      this.sync();
    }).on(RoomEvent.TrackUnsubscribed, (t) => {
      if (t.kind === Track.Kind.Audio) this.stopRemote(t);
      this.pickFloorTrack();
      this.sync();
    }).on(RoomEvent.ActiveSpeakersChanged, () => this.sync()).on(RoomEvent.LocalTrackPublished, () => {
      this.pickFloorTrack();
      this.sync();
    }).on(RoomEvent.LocalTrackUnpublished, () => {
      this.pickFloorTrack();
      this.sync();
    }).on(RoomEvent.Disconnected, () => {
      this.connected = false;
      this.sync();
    }).on(RoomEvent.ParticipantPermissionsChanged, () => {
      const allowed = room.localParticipant.permissions?.canPublish ?? false;
      if (this.role !== "host") this.role = allowed ? "speaker" : "listener";
      if (!allowed && this.micOn) void this.setMic(false);
      this.sync();
    }).on(RoomEvent.RoomMetadataChanged, (m) => {
      this.readMetadata(m);
      this.sync();
    }).on(RoomEvent.DataReceived, (payload, participant) => {
      try {
        const msg = JSON.parse(new TextDecoder().decode(payload));
        if (msg?.t === "share") this.applyShare(msg.share);
        else if (msg?.t === "hb" && participant) this.receiveHeartbeat(participant.identity, msg);
      } catch {
      }
    });
    try {
      await room.connect(info.url, info.token);
      this.connected = true;
      this.error = null;
      this.readMetadata(room.metadata);
      this.sync();
      void room.startAudio().catch(() => {
      });
      this.startEngagement();
    } catch (e) {
      this.error = e instanceof Error ? e.message : String(e);
      this.connected = false;
    }
  }
  /* ----------------------------------------------- engagement / heartbeats */
  /** Begin reporting our own engagement so the host can see who is following. */
  startEngagement() {
    if (typeof document === "undefined") return;
    this.visible = document.visibilityState === "visible";
    this.lastSampleAt = Date.now();
    this.myAttentiveMs = 0;
    this.mySessionMs = 0;
    document.addEventListener("visibilitychange", this.onVisibility);
    this.hbTimer = setInterval(() => this.sendHeartbeat(), 5e3);
  }
  /** Fold the time since the last sample into the attentive / total counters. */
  sampleEngagement() {
    const now = Date.now();
    if (this.lastSampleAt) {
      const dt = now - this.lastSampleAt;
      this.mySessionMs += dt;
      if (this.visible && !this.needsAudioUnlock && this.following) this.myAttentiveMs += dt;
    }
    this.lastSampleAt = now;
  }
  /** Sample precisely at the moment the tab is shown/hidden. */
  onVisibility = () => {
    this.sampleEngagement();
    this.visible = document.visibilityState === "visible";
  };
  sendHeartbeat() {
    const room = this.room;
    if (!room) return;
    this.sampleEngagement();
    const on = this.visible && !this.needsAudioUnlock && this.following;
    const msg = {
      t: "hb",
      a: Math.round(this.myAttentiveMs),
      s: Math.round(this.mySessionMs),
      on,
      v: this.visible,
      au: !this.needsAudioUnlock,
      f: this.following
    };
    void room.localParticipant.publishData(new TextEncoder().encode(JSON.stringify(msg)), { reliable: false }).catch(() => {
    });
  }
  receiveHeartbeat(identity, m) {
    this.engagement[identity] = {
      attentiveMs: m.a ?? 0,
      sessionMs: m.s ?? 0,
      onTask: !!m.on,
      visible: !!m.v,
      audioOk: !!m.au,
      following: !!m.f,
      at: Date.now()
    };
  }
  stopEngagement() {
    if (this.hbTimer) clearInterval(this.hbTimer);
    this.hbTimer = null;
    if (typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", this.onVisibility);
    }
    this.engagement = {};
  }
  /** Audio elements for subscribed remote tracks, keyed by track sid. */
  sinks = /* @__PURE__ */ new Map();
  /**
   * Play a subscribed remote audio track.
   *
   * livekit-client does NOT auto-play remote audio — you get the track and must
   * attach it yourself (their React SDK does this via <RoomAudioRenderer>). Without
   * this, two things break at once: nobody hears the speaker, AND the visualiser
   * stays flat, because Chrome does not pump a remote WebRTC track through Web
   * Audio until it is attached to a playing media element. Measured: an analyser
   * on an unattached remote track reads 0; attached, the same track reads ~1300.
   */
  playRemote(t) {
    const sid = t.sid ?? String(this.sinks.size);
    if (this.sinks.has(sid)) return;
    const el = t.attach();
    el.autoplay = true;
    el.style.cssText = "position:absolute;width:0;height:0;opacity:0;pointer-events:none";
    document.body.appendChild(el);
    void el.play?.().catch(() => {
      this.needsAudioUnlock = true;
    });
    this.sinks.set(sid, el);
  }
  stopRemote(t) {
    const sid = t.sid ?? "";
    const el = this.sinks.get(sid);
    if (el) {
      t.detach(el);
      el.remove();
      this.sinks.delete(sid);
    }
  }
  /** True when the browser blocked playback until the user interacts. */
  needsAudioUnlock = false;
  /** Call from a click handler to satisfy the autoplay policy. */
  async unlockAudio() {
    for (const el of this.sinks.values()) {
      try {
        await el.play();
      } catch {
      }
    }
    await this.room?.startAudio().catch(() => {
    });
    this.needsAudioUnlock = false;
  }
  /** Room metadata carries `{ speaker_id, page }`. Ignore anything malformed
   *  rather than letting a bad payload break the room. */
  readMetadata(raw) {
    if (!raw) {
      this.speakerId = null;
      return;
    }
    try {
      const v = JSON.parse(raw);
      this.speakerId = v.speaker_id ?? null;
      if (Number.isInteger(v.page)) this.applyPage(v.page);
      if (v.share !== void 0) this.applyShare(v.share);
    } catch {
    }
  }
  /** Adopt a shared view from the mic-holder. Ignores echoes of our own writes. */
  applyShare(s, fromRemote = true) {
    if (fromRemote && this.canSpeak && Date.now() - this.lastLocalPageAt < 2e3) return;
    this.share = s;
    if (s?.kind === "page") this.applyPage(s.page, fromRemote);
  }
  /**
   * Broadcast what I am looking at. Only meaningful for the mic-holder; a no-op
   * when sharing is switched off, so they can browse privately and resume later.
   */
  async setShare(s) {
    if (!this.canSpeak || !this.sharing) return;
    if (JSON.stringify(s) === JSON.stringify(this.share)) return;
    this.share = s;
    if (s?.kind === "page") {
      this.page = s.page;
      this.viewPage = s.page;
    }
    this.lastLocalPageAt = Date.now();
    try {
      const msg = { t: "share", share: s };
      await this.room?.localParticipant.publishData(new TextEncoder().encode(JSON.stringify(msg)), { reliable: true });
    } catch {
    }
    if (this.shareWriteTimer) clearTimeout(this.shareWriteTimer);
    this.shareWriteTimer = setTimeout(
      () => {
        const body = s === null ? { kind: null } : s.kind === "page" ? { kind: "page", page: s.page } : s.kind === "mathurat" ? {
          kind: "mathurat",
          version: s.version,
          mode: s.mode,
          idx: s.idx
        } : { kind: "route", path: s.path, label: s.label };
        void fetch(`/api/halaqah/rooms/${this.slug}/share`, {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }).catch(() => {
        });
      },
      500
    );
  }
  /** Stop broadcasting; the room's panel empties until sharing resumes. */
  async stopSharing() {
    this.sharing = false;
    this.share = null;
    this.lastLocalPageAt = Date.now();
    try {
      const msg = { t: "share", share: null };
      await this.room?.localParticipant.publishData(new TextEncoder().encode(JSON.stringify(msg)), { reliable: true });
    } catch {
    }
    void fetch(`/api/halaqah/rooms/${this.slug}/share`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: null })
    }).catch(() => {
    });
  }
  /** Resume broadcasting, starting from the page currently in view. */
  async resumeSharing() {
    this.sharing = true;
    await this.setShare({ kind: "page", page: this.viewPage });
  }
  /** When this client last set the page itself. */
  lastLocalPageAt = 0;
  shareWriteTimer = null;
  /**
   * Adopt a page turn from the reciter; only moves the view if still following.
   *
   * Ignores echoes of our own writes. Turning two pages quickly used to land on
   * the first: the durable POST for page N came back as room metadata after we
   * had already moved to N+1, dragging the view backwards.
   */
  applyPage(p, fromRemote = true) {
    if (p < 1 || p > 604) return;
    if (fromRemote && this.canSpeak && Date.now() - this.lastLocalPageAt < 2e3) return;
    this.page = p;
    if (this.following) this.viewPage = p;
  }
  /**
   * Move the shared page. Only meaningful for whoever holds the floor — the
   * server rejects anyone else, so a listener turning pages just moves their
   * own view (and drops them out of following).
   */
  async setPage(p) {
    if (p < 1 || p > 604) return;
    if (!this.canSpeak) {
      this.following = false;
      this.viewPage = p;
      return;
    }
    await this.setShare({ kind: "page", page: p });
  }
  /** Snap back to the reciter's page and resume following. */
  followSpeaker() {
    this.following = true;
    this.viewPage = this.page;
  }
  /** Enable or disable the local microphone. No-op without publish rights. */
  async setMic(on) {
    const room = this.room;
    if (!room) return;
    if (on && !(room.localParticipant.permissions?.canPublish ?? false)) {
      this.error = "Anda belum diberi mikrofon oleh hos.";
      return;
    }
    try {
      await room.localParticipant.setMicrophoneEnabled(on);
      this.micOn = on;
      this.error = null;
      this.pickFloorTrack();
      this.sync();
    } catch (e) {
      this.error = e instanceof Error ? e.message : String(e);
      this.micOn = false;
    }
  }
  /**
   * Choose which audio track feeds the visualiser: the remote participant who
   * may publish, else our own mic if we hold the floor.
   */
  pickFloorTrack() {
    const room = this.room;
    if (!room) {
      this.floorTrack = null;
      return;
    }
    for (const p of room.remoteParticipants.values()) {
      for (const pub of p.trackPublications.values()) {
        const t = pub.track;
        if (t && t.kind === Track.Kind.Audio && t.mediaStreamTrack) {
          this.floorTrack = t.mediaStreamTrack;
          return;
        }
      }
    }
    const own = room.localParticipant.getTrackPublications().find((p) => p.kind === Track.Kind.Audio)?.track?.mediaStreamTrack;
    this.floorTrack = own ?? null;
  }
  sync() {
    const room = this.room;
    if (!room) {
      this.members = [];
      return;
    }
    const speaking = new Set(room.activeSpeakers.map((p) => p.identity));
    const lp = room.localParticipant;
    const list = [
      {
        identity: lp.identity,
        name: lp.name || lp.identity,
        isLocal: true,
        canPublish: lp.permissions?.canPublish ?? false,
        speaking: speaking.has(lp.identity)
      }
    ];
    for (const p of room.remoteParticipants.values()) {
      list.push({
        identity: p.identity,
        name: p.name || p.identity,
        isLocal: false,
        canPublish: p.permissions?.canPublish ?? false,
        speaking: speaking.has(p.identity)
      });
    }
    this.members = list;
  }
  async disconnect() {
    this.stopEngagement();
    if (this.shareWriteTimer) clearTimeout(this.shareWriteTimer);
    this.shareWriteTimer = null;
    for (const el of this.sinks.values()) el.remove();
    this.sinks.clear();
    await this.room?.disconnect();
    this.room = null;
    this.connected = false;
    this.floorTrack = null;
    this.members = [];
    this.needsAudioUnlock = false;
  }
}
class HalaqahStore {
  /** The live session, or null when not in a room. */
  session = null;
  /**
   * The in-flight join, so concurrent callers share ONE connection.
   *
   * This must be the promise itself, not a flag: an effect that runs twice
   * before the first connect resolves would otherwise open a second LiveKit
   * connection with the same identity, and the server kicks the duplicate —
   * leaving the room stuck on "Menyambung…" forever.
   */
  pending = null;
  get active() {
    return this.session?.connected === true;
  }
  /**
   * Join a room, or return the existing session when it is already this room.
   * Re-entering the room page must NOT reconnect — that would drop audio and
   * re-prompt for the microphone.
   */
  join(slug) {
    const current = this.session;
    if (current && current.slug === slug && current.connected) return Promise.resolve(current);
    if (this.pending?.slug === slug) return this.pending.promise;
    const promise = (async () => {
      if (this.session && this.session.slug !== slug) await this.leave();
      const r = await fetch(`/api/halaqah/rooms/${slug}/join`, { method: "POST", credentials: "same-origin" });
      if (!r.ok) {
        const body = await r.json().catch(() => null);
        throw new Error(body?.error ?? `HTTP ${r.status}`, { cause: r.status });
      }
      const s = new HalaqahSession();
      await s.connect(await r.json());
      this.session = s;
      return s;
    })();
    this.pending = { slug, promise };
    void promise.finally(() => {
      if (this.pending?.promise === promise) this.pending = null;
    });
    return promise;
  }
  /** Leave the room (others carry on). */
  async leave() {
    const s = this.session;
    this.session = null;
    this.pending = null;
    await s?.disconnect();
  }
  /** Host only: end the session for everyone, then leave. */
  async close() {
    const slug = this.session?.slug;
    if (slug) {
      await fetch(`/api/halaqah/rooms/${slug}/close`, { method: "POST", credentials: "same-origin" }).catch(() => {
      });
    }
    await this.leave();
  }
}
const halaqah = new HalaqahStore();
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let slug = page.url.searchParams.get("slug") ?? "";
    const session = derived(() => halaqah.session);
    const active = derived(() => halaqah.active);
    const memberCount = derived(() => session()?.members?.size ?? 0);
    const roomTitle = derived(() => session()?.title ?? session()?.slug ?? "");
    head("fuobe1", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Halaqah — Cakna</title>`);
      });
    });
    $$renderer2.push(`<div class="hlq-root svelte-fuobe1"><header class="hlq-header svelte-fuobe1"><a href="https://cakna.org/hub" class="hdr-btn svelte-fuobe1">`);
    Chevron_left($$renderer2, { size: 20 });
    $$renderer2.push(`<!----></a> <div class="hdr-center svelte-fuobe1">`);
    if (active() && session()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="hdr-badge svelte-fuobe1"><span class="live-dot svelte-fuobe1"></span> Langsung</span> <span class="hdr-title svelte-fuobe1">${escape_html(roomTitle())}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span class="hdr-title svelte-fuobe1">Halaqah</span>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (active() && session()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="hdr-btn hdr-danger svelte-fuobe1" title="Keluar">`);
      Log_out($$renderer2, { size: 18 });
      $$renderer2.push(`<!----></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="w-9 svelte-fuobe1"></div>`);
    }
    $$renderer2.push(`<!--]--></header> <main class="hlq-main svelte-fuobe1">`);
    if (active() && session()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="session-view svelte-fuobe1">`);
      if (session().floorTrack) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="viz-wrap svelte-fuobe1">`);
        AudioVisualizer($$renderer2, { track: session().floorTrack, height: 60 });
        $$renderer2.push(`<!----></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (session().speakerId) {
        $$renderer2.push("<!--[0-->");
        const speaker = session().members.get(session().speakerId);
        $$renderer2.push(`<div class="speaker-card svelte-fuobe1">`);
        Radio($$renderer2, { size: 16, class: "text-emerald-400" });
        $$renderer2.push(`<!----> <span class="speaker-label svelte-fuobe1">Penceramah</span> <span class="speaker-name svelte-fuobe1">${escape_html(speaker?.name ?? "Tidak diketahui")}</span></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <section class="members-section svelte-fuobe1"><h2 class="sec-label svelte-fuobe1">`);
      Users($$renderer2, { size: 13 });
      $$renderer2.push(`<!----> Ahli (${escape_html(memberCount())})</h2> <div class="members-grid svelte-fuobe1"><!--[-->`);
      const each_array = ensure_array_like([...session().members?.values() ?? []]);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let m = each_array[$$index];
        $$renderer2.push(`<div${attr_class("member-chip svelte-fuobe1", void 0, { "member-speaking": m.identity === session().speakerId })}><span class="member-avatar svelte-fuobe1">${escape_html(m.name?.[0]?.toUpperCase() ?? "?")}</span> <span class="member-name svelte-fuobe1">${escape_html(m.name)}</span> `);
        if (m.identity === session().speakerId) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="member-mic svelte-fuobe1">`);
          Mic($$renderer2, { size: 13 });
          $$renderer2.push(`<!----></span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div></section> <div class="controls svelte-fuobe1"><button${attr_class("ctrl-btn svelte-fuobe1", void 0, { "ctrl-active": session().micOn })}>`);
      if (session().micOn) {
        $$renderer2.push("<!--[0-->");
        Mic($$renderer2, { size: 22 });
        $$renderer2.push(`<!----> <span class="svelte-fuobe1">Mik Hidup</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        Mic_off($$renderer2, { size: 22 });
        $$renderer2.push(`<!----> <span class="svelte-fuobe1">Mik Mati</span>`);
      }
      $$renderer2.push(`<!--]--></button> <button class="ctrl-btn svelte-fuobe1">`);
      Copy($$renderer2, { size: 22 });
      $$renderer2.push(`<!----> <span class="svelte-fuobe1">Kongsi</span></button> `);
      if (session().role === "host") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="ctrl-btn ctrl-danger svelte-fuobe1">`);
        X($$renderer2, { size: 22 });
        $$renderer2.push(`<!----> <span class="svelte-fuobe1">Tutup</span></button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<button class="ctrl-btn ctrl-danger svelte-fuobe1">`);
        Log_out($$renderer2, { size: 22 });
        $$renderer2.push(`<!----> <span class="svelte-fuobe1">Keluar</span></button>`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (session().share) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="share-info svelte-fuobe1">`);
        if (session().share.type === "page") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="share-label svelte-fuobe1">`);
          Book_open($$renderer2, { size: 14 });
          $$renderer2.push(`<!----> Halaman ${escape_html(session().share.page)}</span>`);
        } else if (session().share.type === "mathurat") {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<span class="share-label svelte-fuobe1">`);
          Scroll_text($$renderer2, { size: 14 });
          $$renderer2.push(`<!----> Al-Ma'thurat</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="share-label svelte-fuobe1">`);
          Map_pin($$renderer2, { size: 14 });
          $$renderer2.push(`<!----> ${escape_html(session().share.route)}</span>`);
        }
        $$renderer2.push(`<!--]--> `);
        if (!session().following && session().role !== "host") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<button class="follow-btn svelte-fuobe1">Ikut</button>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (session().needsAudioUnlock) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="unlock-btn svelte-fuobe1">Ketik untuk aktifkan audio</button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="lobby svelte-fuobe1"><div class="lobby-hero svelte-fuobe1"><div class="lobby-icon svelte-fuobe1">`);
      Radio($$renderer2, { size: 32 });
      $$renderer2.push(`<!----></div> <h1 class="lobby-title svelte-fuobe1">Halaqah</h1> <p class="lobby-sub svelte-fuobe1">Platform pembelajaran Al-Quran secara langsung bersama-sama.</p></div> <div class="join-card svelte-fuobe1"><h2 class="card-title svelte-fuobe1">Sertai Sesi</h2> <div class="join-row svelte-fuobe1"><input class="join-input svelte-fuobe1" type="text" placeholder="Kod sesi (cth: cakna-123)"${attr("value", slug)}/> <button class="join-btn svelte-fuobe1"${attr("disabled", !slug.trim(), true)}>${escape_html("Sertai")}</button></div> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="features svelte-fuobe1"><div class="feat svelte-fuobe1"><span class="feat-icon svelte-fuobe1">`);
      Book_open($$renderer2, { size: 22 });
      $$renderer2.push(`<!----></span> <div class="svelte-fuobe1"><div class="feat-title svelte-fuobe1">Mushaf Bersama</div> <div class="feat-sub svelte-fuobe1">Halaman Quran disinkron secara masa nyata</div></div></div> <div class="feat svelte-fuobe1"><span class="feat-icon svelte-fuobe1">`);
      Mic($$renderer2, { size: 22 });
      $$renderer2.push(`<!----></span> <div class="svelte-fuobe1"><div class="feat-title svelte-fuobe1">Audio Langsung</div> <div class="feat-sub svelte-fuobe1">Dengar bacaan guru terus dalam sesi</div></div></div> <div class="feat svelte-fuobe1"><span class="feat-icon svelte-fuobe1">`);
      Scroll_text($$renderer2, { size: 22 });
      $$renderer2.push(`<!----></span> <div class="svelte-fuobe1"><div class="feat-title svelte-fuobe1">Al-Ma'thurat Bersama</div> <div class="feat-sub svelte-fuobe1">Bacaan wirid dikongsi dengan ahli sesi</div></div></div></div> <p class="lobby-note svelte-fuobe1">Untuk mencipta sesi, hubungi penganjur atau gunakan apl Cakna.</p></div>`);
    }
    $$renderer2.push(`<!--]--></main></div> `);
    SideNav($$renderer2, { active: "halaqah" });
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
