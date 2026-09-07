import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter, SiteHeader } from "../components/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://swanlawfirm.com"),
  title: { default: "Swan Law Firm, P.C. | Clear help for difficult legal problems", template: "%s | Swan Law Firm, P.C." },
  description: "Swan Law Firm, P.C. helps people, businesses, government leaders, and defense and technology organizations solve difficult legal problems.",
  alternates: { canonical: "/" },
  openGraph: { title: "Swan Law Firm, P.C.", description: "Clear help for difficult legal problems.", type: "website", url: "/" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader />{children}<SiteFooter /></body></html>;
}
