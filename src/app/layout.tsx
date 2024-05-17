'use client'
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { MediaContextProvider } from "./Context/Context";
 
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
      <body className={jackarta.className}>{children}</body>
    </html>
    </MediaContextProvider>
   );
}
