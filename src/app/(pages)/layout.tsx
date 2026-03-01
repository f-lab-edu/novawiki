import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/authProvider";
import { Layout, Toaster } from "@/components";
import { Footer, Header } from "@/features";
import Providers from "@/tanstackProviders";

export const metadata: Metadata = {
  title: "NOVAWIKI",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <AuthProvider>
            <Header />
            <Layout>{children}</Layout>
            <Toaster />
            <Footer />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
