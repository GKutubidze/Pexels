import { createClient } from "pexels";

export const getPexelsClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;
  return createClient(apiKey);
};

 