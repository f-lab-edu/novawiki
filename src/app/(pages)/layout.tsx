import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/tanstackProviders";
import { Footer, Header, Toast } from "@/widgets";
import { Layout } from "@/components";

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
          <Header />
          <Layout>{children}</Layout>
          <Toast />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
