import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    // If opened via local network IP (e.g. 10.21.96.179)
    if (host && host !== "localhost" && host !== "127.0.0.1" && host !== "10.0.2.2") {
      return `http://${host}:8000/api`;
    }
    // If Android emulator
    if (host === "10.0.2.2") {
      return "http://10.0.2.2:8000/api";
    }
    // If running in Capacitor Android or phone browser
    const isAndroid = /android/i.test(navigator.userAgent);
    if (isAndroid) {
      return "http://10.21.96.179:8000/api";
    }
  }
  return "http://127.0.0.1:8000/api";
}

export const API_BASE = "http://10.21.96.179:8000/api";

