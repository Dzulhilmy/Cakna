// Server-only persistence for CAKNA notifications (data/notifications.json).
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "node:crypto";
import type { Notification, NotificationInput } from "./notifications";

const FILE = path.join(process.cwd(), "data", "notifications.json");

async function readAll(): Promise<Notification[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Notification[]) : [];
  } catch {
    return [];
  }
}

export async function getNotifications(): Promise<Notification[]> {
  const all = await readAll();
  return all.slice().reverse(); // newest first
}

export async function addNotification(
  input: NotificationInput,
): Promise<Notification> {
  const all = await readAll();
  const record: Notification = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  all.push(record);
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(all, null, 2), "utf8");
  return record;
}
