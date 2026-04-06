import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Triviora | Personalized Life Management Platform",
  description:
    "Triviora is a personalized life management platform designed to help you achieve balance across mind, body, and spirit. By tracking your daily activities—from spiritual practices and physical health to nutrition and productivity—Triviora provides intelligent insights and guidance to improve your overall well-being. Stay consistent, build meaningful habits, and live a more aligned and intentional life.",
  keywords: [
    "Triviora",
    "Life Management",
    "Personalized",
    "Balance",
    "Mind",
    "Body",
    "Spirit",
    "Habits",
    "Productivity",
    "Well-being",
    "Intentional Living",
  ],
  openGraph: {
    title: "Triviora | Personalized Life Management Platform",
    description:
      "Triviora is a personalized life management platform designed to help you achieve balance across mind, body, and spirit. By tracking your daily activities—from spiritual practices and physical health to nutrition and productivity—Triviora provides intelligent insights and guidance to improve your overall well-being. Stay consistent, build meaningful habits, and live a more aligned and intentional life.",
    url: "https://triviora.com",
    siteName: "Triviora",
    images: [
      {
        url: "https://triviora.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Triviora | Personalized Life Management Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Triviora | Personalized Life Management Platform",
    description:
      "Triviora is a personalized life management platform designed to help you achieve balance across mind, body, and spirit. By tracking your daily activities—from spiritual practices and physical health to nutrition and productivity—Triviora provides intelligent insights and guidance to improve your overall well-being. Stay consistent, build meaningful habits, and live a more aligned and intentional life.",
    images: ["https://triviora.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", outfit.variable)}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
