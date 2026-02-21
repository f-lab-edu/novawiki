import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/authProvider";
import { Layout, Toaster } from "@/components";
import Providers from "@/tanstackProviders";
import { Footer, Header } from "@/widgets";

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
