import { createClient } from "pexels";

export const getPexelsClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY as string | undefined;
  if (!apiKey) {
    console.error(
      "Pexels API key is not set. Please set the NEXT_PUBLIC_API_KEY environment variable."
    );
    // Optionally, throw an error or return a default client
    throw new Error(
      "Pexels API key is required. Please set the NEXT_PUBLIC_API_KEY environment variable."
    );
    // return null; // Uncomment this line if you prefer returning null instead of throwing an error
  }
  return createClient(apiKey);
};
