import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// To handle error manage globally
export const handleError = (error, statusCode = 500) => {

  const errorMessage = typeof error === "string" ? error : error.message || "Unknown error";

  return new Response(
    JSON.stringify({ message: "Error", error: errorMessage }),
    { status: statusCode, headers: { "Content-Type": "application/json" } }
  );
};