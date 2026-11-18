import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }
  if (typeof window !== "undefined") {
    // If deployed on HTTPS (e.g. Netlify/Vercel) without custom backend URL,
    // prevent browser Mixed Content blocks and let the client-side Edge AI run immediately
    if (window.location.protocol === "https:") {
      return "";
    }
    const host = window.location.hostname;
    // If Android emulator
    if (host === "10.0.2.2") {
      return "http://10.0.2.2:8000/api";
    }
    // If opened via local network or localhost
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      return `http://${host}:8000/api`;
    }
    return "http://127.0.0.1:8000/api";
  }
  return "http://127.0.0.1:8000/api";
}

export const API_BASE = typeof window !== "undefined" ? getApiBase() : "http://127.0.0.1:8000/api";

