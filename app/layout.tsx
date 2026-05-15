import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});



export const metadata = {
  title: "RI:AN Tattoo Booking",
  description:
    "Watercolor tattoo booking form for RI:AN.",
  openGraph: {
    title: "RI:AN Tattoo Booking",
    description:
      "Watercolor tattoo booking form for RI:AN.",
    url: "https://riantattoo.com",
    siteName: "RI:AN",
    images: [
      {
        url: "https://riantattoo.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${cormorant.className} min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}
