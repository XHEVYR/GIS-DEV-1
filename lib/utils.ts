import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 10) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const current = currentPage;
  const last = totalPages;
  const delta = 1;
  const left = current - delta;
  const right = current + delta + 1;
  const range: number[] = [];
  const rangeWithDots: (number | string)[] = [];
  let l: number | null = null;

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= left && i < right)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
};