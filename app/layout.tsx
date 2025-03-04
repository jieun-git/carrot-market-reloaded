import type { Metadata } from "next";
import { Roboto, Rubik_Scribble } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  variable: "--roboto-text",
});

const rubik = Rubik_Scribble({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  variable: "--rubik-text",
});

const metallica = localFont({
  src: "./Metallica.ttf",
  variable: "--metallica-text",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Karrot Market",
    default: "Karrot Market",
  },
  description: "Sell and buy all the things!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${rubik.variable} ${metallica.variable} bg-gray-900 text-white max-w-screen-sm mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}
