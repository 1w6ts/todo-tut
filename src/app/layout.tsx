import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { TRPCProvider } from "@/utils/trpc/provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistSans.className} antialiased`}
      >
        <TRPCProvider>
          <Toaster position="top-right" />
          {children}
        </TRPCProvider>
      </body>
    </html>
  );
}
