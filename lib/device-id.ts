import { generateId } from "@/lib/uuid";

const KEY = "photosheet.device_id.v1";

export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = generateId("d");
    localStorage.setItem(KEY, id);
  }
  return id;
}
