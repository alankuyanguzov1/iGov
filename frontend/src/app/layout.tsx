import type { Metadata } from "next";
import { Unbounded, Golos_Text } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["cyrillic", "latin"],
  weight: ["600", "700"],
});

const golosText = Golos_Text({
  variable: "--font-golos",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "GovAid Navigator",
  description:
    "Персональный навигатор по мерам государственной поддержки Казахстана",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${unbounded.variable} ${golosText.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
