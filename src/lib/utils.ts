import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Стандартная shadcn-style утилита: склеивает классы и схлопывает Tailwind-конфликты
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
