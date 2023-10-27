import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatter = new Intl.NumberFormat("es-MX", {
  style : 'currency',
  currency : 'MXN'
})

export const integerFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 0, // Configura el número máximo de decimales a 0.
});