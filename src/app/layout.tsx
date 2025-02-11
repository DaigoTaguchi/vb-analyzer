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
      <body>
        <Header />
        <div className="container mx-auto my-auto px-4 py-4">{children}</div>
      </body>
      <PrelineScript />
    </html>
  );
}
