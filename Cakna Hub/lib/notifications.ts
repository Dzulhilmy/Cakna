// Client-safe types, templates & helpers for CAKNA notifications.
// (No filesystem here — see lib/notifications-store.ts for persistence.)

export type NotificationType = "kemalangan" | "takziah" | "kesihatan" | "umum";

export const TYPE_LABELS: Record<NotificationType, string> = {
  kemalangan: "Accident",
  takziah: "Condolences",
  kesihatan: "Health Announcement",
  umum: "General Announcement",
};

export function typeLabel(t: string): string {
  return (TYPE_LABELS as Record<string, string>)[t] ?? t;
}

export type Block = { kind: "p" | "quote"; text: string };

/** Split composed content into paragraph/quote blocks. Lines starting with ">" are quotes. */
export function parseContent(content: string): Block[] {
  return content
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((para) =>
      para.startsWith(">")
        ? { kind: "quote" as const, text: para.replace(/^>\s?/gm, "").trim() }
        : { kind: "p" as const, text: para },
    );
}

export type Notification = {
  id: string;
  createdAt: string;
  type: NotificationType;
  title: string;
  content: string;
  callout: string;
  audience: string;
  createdBy?: { id: string; name: string };
};

export type NotificationInput = Omit<Notification, "id" | "createdAt">;

const MONTHS_MS = [
  "Januari",
  "Februari",
  "Mac",
  "April",
  "Mei",
  "Jun",
  "Julai",
  "Ogos",
  "September",
  "Oktober",
  "November",
  "Disember",
];
const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function fmtDate(iso: string, months: string[]): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const [, y, mo, d] = m;
  return `${Number(d)} ${months[Number(mo) - 1] ?? mo} ${y}`;
}

/** Malay-month date — used inside the (Malay) notification card content. */
export function malayDate(iso: string): string {
  return fmtDate(iso, MONTHS_MS);
}

/** English-month date — used in the English UI (e.g. announcements list meta). */
export function englishDate(iso: string): string {
  return fmtDate(iso, MONTHS_EN);
}

export type TemplateField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "date";
  required?: boolean;
  placeholder?: string;
};

export type NotificationTemplate = {
  id: NotificationType;
  name: string;
  description: string;
  audience: string;
  fields: TemplateField[];
  generate: (v: Record<string, string>) => {
    title: string;
    content: string;
    callout: string;
  };
};

const AUDIENCE_DEFAULT = "All Franchisees, MTs & clients";

export const TEMPLATES: NotificationTemplate[] = [
  {
    id: "kemalangan",
    name: "Accident",
    description: "Announcement of an MT accident or injury.",
    audience: AUDIENCE_DEFAULT,
    fields: [
      { name: "namaMT", label: "MT Name", type: "text", required: true, placeholder: "e.g. MT Syakirah Adilah" },
      { name: "tarikh", label: "Date of incident", type: "date", required: true },
      { name: "tujuan", label: "On the way to", type: "text", placeholder: "e.g. attend FAST in Jenjarom" },
      { name: "kecederaan", label: "Injury details", type: "textarea", placeholder: "e.g. MT suffered a broken arm (requiring surgery) and lacerations that were stitched." },
      { name: "hospital", label: "Referred to", type: "text", placeholder: "e.g. Hospital Temerloh" },
    ],
    generate: (v) => ({
      title: `Accident — ${v.namaMT || "MT"}`,
      content: [
        "Assalamualaikum dan salam sejahtera.",
        `Dimaklumkan ${v.namaMT || "MT"} telah mengalami kemalangan pada ${v.tarikh ? malayDate(v.tarikh) : "(tarikh)"}${v.tujuan ? `, dalam perjalanan untuk ${v.tujuan}` : ""}.`,
        `Alhamdulillah, tiada kecederaan yang mengancam nyawa.${v.kecederaan ? ` ${v.kecederaan}` : ""}${v.hospital ? ` ${v.namaMT || "MT"} kini dirujuk ke ${v.hospital} untuk rawatan susulan berdekatan keluarga.` : ""}`,
        `🤲 Marilah kita doakan kesembuhan dan kekuatan buat ${v.namaMT || "MT"}.`,
      ].join("\n\n"),
      callout: [
        "Buat semua Franchaisi — jom kongsikan cakna ini kepada MT dan klien di bawah seliaan kita.",
        `Buat MT dan klien — mari sama-sama doakan ${v.namaMT || "MT"}, dan hulurkan cakna kepada orang sekeliling kita.`,
        "Semoga Allah permudahkan segala urusan rawatan dan pemulihan. Aamiin. 🤍",
      ].join("\n\n"),
    }),
  },
  {
    id: "takziah",
    name: "Condolences",
    description: "Condolence message for the passing of an MT family member.",
    audience: AUDIENCE_DEFAULT,
    fields: [
      { name: "hubungan", label: "Relationship to the MT", type: "text", required: true, placeholder: "e.g. father of MT Nadia and MT Hafizan (HOME Sungai Ara)" },
      { name: "namaSiMati", label: "Name of the deceased (Allahyarham/Allahyarhamah)", type: "text", required: true, placeholder: "e.g. Tn Zulkipli bin Mohamed Noor" },
      { name: "tarikh", label: "Date of passing", type: "date", required: true },
    ],
    generate: (v) => ({
      title: `Condolences — Allahyarham ${v.namaSiMati || ""}`.trim(),
      content: [
        "Assalamualaikum dan salam sejahtera.",
        `Dengan hati yang hiba, dimaklumkan ${v.hubungan || "(hubungan)"}, iaitu Allahyarham ${v.namaSiMati || "(nama)"}, telah kembali ke rahmatullah pada ${v.tarikh ? malayDate(v.tarikh) : "(tarikh)"}.`,
        "Al-Fatihah 🤲",
        '> "Sesungguhnya kami milik Allah dan kepada-Nya kami kembali" (Al-Baqarah: 156)',
        "Semoga Allahyarham ditempatkan bersama golongan yang beriman dan beramal soleh. Aamiin.",
      ].join("\n\n"),
      callout: [
        "Buat semua Franchaisi — jom sama-sama hulurkan sokongan dan cakna ini kepada MT dan klien di bawah seliaan kita.",
        "Buat MT dan klien — mari kita cakna sesama sendiri dan orang sekeliling, kerana setiap doa yang dihantar itu satu sedekah.",
        "Semoga rantaian kasih ini jadi kekuatan buat ahli keluarga yang ditinggalkan. 🤍",
      ].join("\n\n"),
    }),
  },
  {
    id: "kesihatan",
    name: "Health Announcement",
    description: "Health warning / precautionary measures.",
    audience: AUDIENCE_DEFAULT,
    fields: [
      { name: "program", label: "Programme involved", type: "text", required: true, placeholder: "e.g. TTT Pra FaST & FAST Jenjarom" },
      { name: "penyakit", label: "Illness / infection", type: "text", required: true, placeholder: "e.g. Influenza A" },
      { name: "gejala", label: "Symptoms", type: "textarea", placeholder: "e.g. fever, cough, sore throat, flu, body aches or feeling unwell" },
    ],
    generate: (v) => ({
      title: `Health Announcement — ${v.penyakit || ""}`.trim(),
      content: [
        "Assalamualaikum dan salam sejahtera,",
        `Dimaklumkan bahawa majoriti Team HQ yang mengendalikan ${v.program || "(program)"} telah dijangkiti ${v.penyakit || "(penyakit)"}.`,
        `Sehubungan itu, sebagai langkah berjaga-jaga, kepada semua yang telah menghadiri program tersebut, sekiranya mengalami gejala seperti ${v.gejala || "demam, batuk, sakit tekak, selesema, sakit badan atau kurang sihat"}, disarankan untuk mendapatkan pemeriksaan dan rawatan di klinik atau hospital dengan segera.`,
        "Bagi yang mempunyai bayi, warga emas atau ahli keluarga yang berisiko tinggi di rumah, dinasihatkan agar mengambil langkah pencegahan seperti memakai pelitup muka sekiranya bergejala, menjaga kebersihan diri serta memantau keadaan kesihatan masing-masing.",
      ].join("\n\n"),
      callout:
        "Makluman ini disampaikan sebagai langkah berjaga-jaga dan tanda keprihatinan terhadap kesihatan semua. Semoga Allah SWT mengurniakan kesembuhan kepada semua yang sedang diuji serta melindungi kita dan keluarga daripada sebarang penyakit.",
    }),
  },
  {
    id: "umum",
    name: "General Announcement",
    description: "General announcement — free-form title & content.",
    audience: AUDIENCE_DEFAULT,
    fields: [
      { name: "tajuk", label: "Announcement title", type: "text", required: true },
      { name: "kandungan", label: "Content", type: "textarea", required: true, placeholder: "Write your message here…" },
    ],
    generate: (v) => ({
      title: v.tajuk || "Announcement",
      content: v.kandungan || "",
      callout: "Bersama Kita CAKNA — semoga makluman ini bermanfaat untuk semua. 🤍",
    }),
  },
];

export function getTemplate(id: string): NotificationTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
