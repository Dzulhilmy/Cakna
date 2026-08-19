import { d as ensure_array_like, g as attr, f as attr_class, e as escape_html, h as derived, af as clsx } from "./index.js";
import { p as page } from "./index2.js";
import { r as roleLabel } from "./types.js";
import { E as External_link } from "./external-link.js";
function AdminNav($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { role } = $$props;
    const baseLinks = [
      { href: "/hub/admin/dashboard", label: "Dashboard" },
      { href: "/hub/admin/funding", label: "Funding" },
      { href: "/hub/admin/calendar", label: "QC Calendar" }
    ];
    const reviewerLinks = [
      { href: "/hub/admin/analytics", label: "Analytics" },
      { href: "/hub/admin/notifications", label: "Announcements" }
    ];
    const adminOnlyLinks = [
      { href: "/hub/admin/programs", label: "Programs" },
      { href: "/hub/admin/site", label: "Website" },
      { href: "/hub/admin/media", label: "Media" },
      { href: "/hub/admin/users", label: "Users" }
    ];
    const links = derived(() => {
      if (role === "admin") return [...baseLinks, ...reviewerLinks, ...adminOnlyLinks];
      if (role === "reviewer") return [...baseLinks, ...reviewerLinks];
      return baseLinks;
    });
    const pathname = derived(() => page.url.pathname);
    $$renderer2.push(`<nav class="flex flex-col gap-0.5 pt-1"><!--[-->`);
    const each_array = ensure_array_like(links());
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let link = each_array[$$index];
      const active = pathname() === link.href || pathname().startsWith(link.href + "/");
      $$renderer2.push(`<a${attr("href", link.href)}${attr("aria-current", active ? "page" : void 0)}${attr_class(`relative inline-flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-rose-50 text-rose-700" : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900"}`)}>`);
      if (active) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-rose-500"></span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> ${escape_html(link.label)}</a>`);
    }
    $$renderer2.push(`<!--]--> <div class="my-2 border-t border-zinc-200/60"></div> <a href="https://cakna.org/admin" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition-colors hover:bg-emerald-50 hover:text-emerald-700"><span>Mathurat Dashboard</span> `);
    External_link($$renderer2, { size: 13, class: "shrink-0 opacity-50" });
    $$renderer2.push(`<!----></a></nav>`);
  });
}
function AdminSidebar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { user } = $$props;
    let open = false;
    $$renderer2.push(`<aside class="no-print border-b border-zinc-200 bg-white md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col md:border-b-0 md:border-r md:bg-zinc-50/60"><div class="flex items-center justify-between gap-3 px-4 py-3.5 md:px-5 md:py-4"><a href="/" class="flex items-center gap-2 group"><img src="/logo.jpg" alt="Cakna" class="h-14 w-auto" style="mix-blend-mode:multiply"/> <span class="text-sm font-bold tracking-wide text-zinc-700">Cakna <span class="text-rose-600">Hub</span></span></a> <div class="flex items-center gap-1"><a href="/" class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 md:hidden">← Hub</a> <button type="button"${attr(
      "aria-expanded",
      // close mobile menu on navigation
      open
    )}${attr("aria-label", "Open menu")} class="inline-flex items-center justify-center rounded-lg p-2 text-zinc-700 transition-colors hover:bg-zinc-100 md:hidden">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>`);
    }
    $$renderer2.push(`<!--]--></button></div></div> <div${attr_class(`${"hidden"} border-t border-zinc-200 md:flex md:flex-1 md:flex-col md:border-t-0 md:overflow-hidden`)}><div class="admin-nav-scroll px-3 py-3 md:flex-1 md:overflow-y-auto">`);
    AdminNav($$renderer2, { role: user.role });
    $$renderer2.push(`<!----></div> <div class="border-t border-zinc-200 bg-white p-3"><div class="mb-1.5 flex items-center gap-2.5 px-2 py-1.5"><span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-semibold text-rose-700">${escape_html(user.name.split(" ").slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase())}</span> <div class="min-w-0"><p class="truncate text-sm font-medium leading-tight text-zinc-800">${escape_html(user.name)}</p> <p class="text-xs text-zinc-400">${escape_html(roleLabel(user.role))}</p></div></div> <div class="flex flex-col gap-0.5"><form method="POST" action="/logout"><button type="submit" class="inline-flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"><svg class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"></path></svg> Log out</button></form> <a href="/" class="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"><svg class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path></svg> Back to hub</a></div></div></div></aside>`);
  });
}
function AdminShell($$renderer, $$props) {
  let {
    user,
    contentClassName = "mx-auto max-w-5xl px-6 py-8 md:py-10",
    children
  } = $$props;
  $$renderer.push(`<div class="min-h-screen bg-zinc-50/40 md:flex">`);
  AdminSidebar($$renderer, { user });
  $$renderer.push(`<!----> <main class="flex-1 min-w-0"><div${attr_class(clsx(contentClassName))}>`);
  children($$renderer);
  $$renderer.push(`<!----></div></main></div>`);
}
export {
  AdminShell as A
};
