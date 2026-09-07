"use client";

import Link from "next/link";
import { useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="container nav-wrap">
    <Link className="brand" href="/" aria-label="Swan Law Firm home"><span className="brand-mark" aria-hidden="true">S</span><span><strong>SWAN LAW FIRM, P.C.</strong></span></Link>
    <button className="menu-toggle" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>Menu</button>
    <nav id="primary-nav" className={`primary-nav${open ? " open" : ""}`} aria-label="Primary navigation">
      <Link href="/about">About</Link><Link href="/practice-areas">What we do</Link><Link href="/client-service">How we help</Link><Link href="/contact" className="nav-cta">Start a conversation</Link>
    </nav>
  </div></header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="container footer-top"><Link className="brand footer-brand" href="/"><span className="brand-mark" aria-hidden="true">S</span><span><strong>SWAN LAW FIRM, P.C.</strong></span></Link><p>Clear help for difficult legal problems.</p><div className="footer-links"><Link href="/contact">Contact</Link><Link href="/practice-areas">What we do</Link><Link href="/about">About</Link></div></div><div className="container legal"><p><strong>Important legal notice:</strong> This website provides general information only. It is not legal advice and does not create an attorney-client relationship. Past results do not guarantee future outcomes. Do not send confidential or time-sensitive information through this website. Attorney advertising.</p><p>© {new Date().getFullYear()} Swan Law Firm, P.C.</p></div></footer>;
}

export function CTA({ children = "Discuss your matter" }: { children?: React.ReactNode }) {
  return <Link className="button button-primary" href="/contact">{children} <span aria-hidden="true">→</span></Link>;
}
