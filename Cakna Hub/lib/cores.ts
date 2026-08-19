export type Core = {
  id: string;
  name: string;
  tagline: string;
  programs: string[];
  pic: string[];
  /** lucide-react icon name (see components/CoreCard.tsx icon map) */
  icon: string;
};

/**
 * The 7 Core initiatives of Cakna, seeded from the whiteboard.
 * Single source of truth — rendered by the UI and served via /api/cores.
 */
export const cores: Core[] = [
  {
    id: "assist",
    name: "Assist",
    tagline: "Welfare & aid",
    programs: ["A Million Smiles"],
    pic: ["Cakna"],
    icon: "HeartHandshake",
  },
  {
    id: "biz",
    name: "Biz",
    tagline: "Business & governance",
    programs: ["MKT Blast", "HSC"],
    pic: ["Finance", "MKTG"],
    icon: "Briefcase",
  },
  {
    id: "circle",
    name: "Circle",
    tagline: "Health & care",
    programs: ["BMI", "See-Heart"],
    pic: ["MI", "BOD", "FO", "Cakna"],
    icon: "HeartPulse",
  },
  {
    id: "digital",
    name: "Digital",
    tagline: "Digital innovation & community apps",
    programs: ["Cakna App", "Edu App", "Biz App"],
    pic: ["IT", "MKTG", "QCXIS"],
    icon: "Smartphone",
  },
  {
    id: "edu",
    name: "Edu",
    tagline: "Education & human development",
    programs: ["Edu Maths", "Edu Care", "Edu Lab"],
    pic: ["RBE", "Training", "Cakna"],
    icon: "GraduationCap",
  },
  {
    id: "future",
    name: "Future",
    tagline: "Leadership & new-generation motivation",
    programs: ["Leadership Program", "SPM Seminar"],
    pic: ["Training"],
    icon: "Rocket",
  },
  {
    id: "green",
    name: "Green",
    tagline: "Environmental sustainability & green community",
    programs: ["Go Green", "Green Cycle", "Green Light"],
    pic: ["Logistik", "MI", "IT"],
    icon: "Leaf",
  },
];

/** URL-safe slug from a program name, e.g. "MKT Blast" → "mkt-blast". */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Look up a core by its id. */
export function getCore(id: string): Core | undefined {
  return cores.find((c) => c.id === id);
}
