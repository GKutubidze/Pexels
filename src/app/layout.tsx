'use client'
 import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { MediaContextProvider } from "./Context/MediaContext";
import { Metadata } from "next";
  
const jackarta = Plus_Jakarta_Sans({ subsets: ["latin"] });


  const metadata: Metadata = {
  title: "Pexels",
  description: "Pexels.com Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)

{

 
  return (
    <MediaContextProvider>
     <html lang="en">
     <head>
           <title>{metadata.title as string}</title>
          <meta name="description" content={metadata.description as string} />       
        </head>

      <body className={jackarta.className}>{children}</body>
    </html>
    </MediaContextProvider>
   );
}
