import { createClient } from "pexels";

export const getPexelsClient = () => {
  const apiKey = process.env.API_KEY as string | undefined;
  if (!apiKey) {
    console.error(
      "Pexels API key is not set. Please set the NEXT_PUBLIC_API_KEY environment variable."
    );
    // You can provide a default API key here or throw an error
    return null;
  }
  return createClient(apiKey);
};
