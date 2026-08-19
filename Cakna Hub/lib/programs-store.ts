// Server-only persistence for the program catalog (data/programs.json).
// Programs are fully admin-managed (CRUD). The catalog is seeded once from the
// 7 cores' hardcoded programs; after that the JSON file is authoritative.
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "node:crypto";
import { cores, getCore, slugify, type Core } from "./cores";

const FILE = path.join(process.cwd(), "data", "programs.json");

export type Program = {
  id: string;
  coreId: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export type ProgramInput = {
  coreId: string;
  name: string;
  description?: string;
  image?: string;
};

/** Default catalog, derived from the 7 cores' seeded program names. */
function seed(): Program[] {
  const list: Program[] = [];
  for (const core of cores) {
    for (const name of core.programs) {
      list.push({
        id: `${core.id}--${slugify(name)}`,
        coreId: core.id,
        name,
        slug: slugify(name),
        description: "",
        image: "",
        createdAt: "",
        updatedAt: "",
      });
    }
  }
  return list;
}

async function readRaw(): Promise<Program[] | null> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Program[]) : null;
  } catch {
    return null;
  }
}

async function writeAll(list: Program[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf8");
}

/** All programs. Falls back to the seed until the file is first written. */
export async function getPrograms(): Promise<Program[]> {
  return (await readRaw()) ?? seed();
}

/** Programs grouped by core id (every core present, even if empty). */
export async function getProgramsByCore(): Promise<Record<string, Program[]>> {
  const all = await getPrograms();
  const map: Record<string, Program[]> = {};
  for (const core of cores) map[core.id] = [];
  for (const p of all) (map[p.coreId] ??= []).push(p);
  return map;
}

export async function getProgramsForCore(coreId: string): Promise<Program[]> {
  return (await getPrograms()).filter((p) => p.coreId === coreId);
}

/** Resolve a core + program from a core id and program slug. */
export async function resolveProgram(
  coreId: string,
  slug: string,
): Promise<{ core: Core; program: Program } | null> {
  const core = getCore(coreId);
  if (!core) return null;
  const program = (await getProgramsForCore(coreId)).find(
    (p) => p.slug === slug,
  );
  return program ? { core, program } : null;
}

function validate(all: Program[], input: ProgramInput, ignoreId?: string) {
  const name = input.name.trim();
  if (!name) throw new Error("Program name is required.");
  if (!getCore(input.coreId)) throw new Error("Please choose a valid core.");
  const slug = slugify(name);
  if (!slug) throw new Error("Program name must include letters or numbers.");
  if (
    all.some(
      (p) => p.id !== ignoreId && p.coreId === input.coreId && p.slug === slug,
    )
  ) {
    throw new Error("A program with this name already exists in this core.");
  }
  return { name, slug };
}

export async function createProgram(input: ProgramInput): Promise<Program> {
  const all = await getPrograms();
  const { name, slug } = validate(all, input);
  const now = new Date().toISOString();
  const program: Program = {
    id: randomUUID(),
    coreId: input.coreId,
    name,
    slug,
    description: (input.description ?? "").trim(),
    image: (input.image ?? "").trim(),
    createdAt: now,
    updatedAt: now,
  };
  all.push(program);
  await writeAll(all);
  return program;
}

export async function updateProgram(
  id: string,
  input: ProgramInput,
): Promise<Program> {
  const all = await getPrograms();
  const program = all.find((p) => p.id === id);
  if (!program) throw new Error("Program not found.");
  const { name, slug } = validate(all, input, id);
  program.coreId = input.coreId;
  program.name = name;
  program.slug = slug;
  program.description = (input.description ?? "").trim();
  program.image = (input.image ?? "").trim();
  program.updatedAt = new Date().toISOString();
  await writeAll(all);
  return program;
}

export async function deleteProgram(id: string): Promise<boolean> {
  const all = await getPrograms();
  const next = all.filter((p) => p.id !== id);
  if (next.length === all.length) return false;
  await writeAll(next);
  return true;
}
