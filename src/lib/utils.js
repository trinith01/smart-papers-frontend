import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Converts an image ID or URL to a full image URL
 * @param {string} value - Image ID, URL, or base64 data
 * @returns {string|null} Full image URL or null if no value
 */
export function getImageUrl(value) {
  if (!value) return null;

  // If it's already a data URL (base64), return as-is
  if (value.startsWith("data:image/")) {
    return value;
  }

  // If it's already a full URL, return as-is
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  // If it starts with /image, it's already a relative URL
  if (value.startsWith("/image")) {
    return value;
  }

  // Otherwise, treat it as an image ID and construct the URL
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  return `${apiBaseUrl}/image?id=${value}`;
}
