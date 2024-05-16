'use client'
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { MyContext } from "./Context";
import { PhotosWithTotalResults } from "pexels";
import { useState } from "react";

const jackarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

 const metadata: Metadata = {
  title: "Pexels",
  description: "Pexels.com CLone",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)

{

  const [searchedPhotos,setSearchedPhotos]=useState<PhotosWithTotalResults>({
    photos: [],
    page: 0,
    per_page: 0,
    total_results: 0,
    next_page: 0
     
  });
  return (
    <MyContext.Provider value={{searchedPhotos,setSearchedPhotos}}>
    <html lang="en">
      <body className={jackarta.className}>{children}</body>
    </html>
    </MyContext.Provider>
  );
}
