import type { Metadata } from "next";
import "./globals.css";
import PrelineScript from "./components/PrelineScript";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "vb-analyser",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center">
        <Header />
        <main className="w-full max-w-auto mx-auto px-4 py-8">{children}</main>
      </body>
      <PrelineScript />
    </html>
  );
}
