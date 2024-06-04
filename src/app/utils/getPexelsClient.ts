// src/utils/pexelsClient.ts
import { createClient } from "pexels";

export const getPexelsClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  if (!apiKey) {
    console.error(
      "Pexels API key is not set. Please set the NEXT_PUBLIC_API_KEY environment variable."
    );
    throw new Error(
      "Pexels API key is required. Please set the NEXT_PUBLIC_API_KEY environment variable."
    );
  }

  return createClient(apiKey);
};
