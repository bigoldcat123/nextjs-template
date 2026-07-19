import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sleep(mil: number) {
  await new Promise((e) => {
    setTimeout(() => {
      e(0);
    }, mil);
  });
}
