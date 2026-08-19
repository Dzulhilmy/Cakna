// One-off seed: writes data/users.json with hashed demo accounts.
// Run: node scripts/seed-users.mjs
import { scryptSync, randomBytes, randomUUID } from "node:crypto";
import { promises as fs } from "fs";
import path from "path";

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const now = new Date().toISOString();

const users = [
  {
    id: randomUUID(),
    name: "HQ Admin",
    email: "admin@cakna.com",
    passwordHash: hashPassword("admin123"),
    role: "admin",
    branch: "HQ",
    status: "active",
    createdAt: now,
  },
  {
    id: randomUUID(),
    name: "Team CAKNA",
    email: "reviewer@cakna.com",
    passwordHash: hashPassword("review123"),
    role: "reviewer",
    branch: "HQ",
    status: "active",
    createdAt: now,
  },
  {
    id: randomUUID(),
    name: "Aiman (Terengganu)",
    email: "franchisee@cakna.com",
    passwordHash: hashPassword("franchise123"),
    role: "franchisee",
    branch: "Kuala Terengganu",
    status: "active",
    createdAt: now,
  },
  {
    id: randomUUID(),
    name: "Sofea (Kuantan)",
    email: "pending@cakna.com",
    passwordHash: hashPassword("pending123"),
    role: "franchisee",
    branch: "Kuantan",
    status: "pending",
    createdAt: now,
  },
];

const file = path.join(process.cwd(), "data", "users.json");
await fs.mkdir(path.dirname(file), { recursive: true });
await fs.writeFile(file, JSON.stringify(users, null, 2), "utf8");
console.log(`Seeded ${users.length} users → ${file}`);
