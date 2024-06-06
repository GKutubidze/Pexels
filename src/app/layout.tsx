"use client";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { MediaContextProvider } from "./Context/MediaContext";
import { Metadata } from "next";

const jackarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "SnapStock",
  description:
    "SnapStock offers a vast collection of high-quality, free stock photos and videos for personal and commercial use. Discover stunning images and footage to enhance your creative projects, all available for download without any cost.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MediaContextProvider>
      <html lang="en">
        <head>
          <title>{metadata.title as string}</title>
          <link rel="icon" href="/images/favicon.ico" sizes="any" />
          <meta name="description" content={metadata.description as string} />
        </head>

        <body className={jackarta.className}>{children}</body>
      </html>
    </MediaContextProvider>
  );
}
