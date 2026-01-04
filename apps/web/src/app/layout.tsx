import type { Metadata } from "next";

import { Inter } from "next/font/google";

import "../index.css";
import Header from "@/components/core/header";
import Providers from "@/components/core/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});
export const metadata: Metadata = {
  title: "boilerplate",
  description: "boilerplate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
