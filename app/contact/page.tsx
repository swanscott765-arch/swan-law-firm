"use client";

import { FormEvent, useState } from "react";

export default function Contact() {
  const [status, setStatus] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Sending securely…");
    const form = new FormData(event.currentTarget);
    const intakeUrl = process.env.NEXT_PUBLIC_INTAKE_URL || "/api/intake";
    if (intakeUrl === "/api/intake") {
      setStatus("Secure intake is not configured for this static deployment. Please contact the firm directly.");
      return;
    }
    const response = await fetch(intakeUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    setStatus(response.ok ? "Thank you. Our intake team will respond discreetly." : "We could not send your message. Please try again.");
    if (response.ok) event.currentTarget.reset();
  }
  return <main><section className="inner-hero"><div className="container"><p className="eyebrow">START HERE</p><h1>Tell us what<br /><em>matters.</em></h1><p>Share a few details and our intake team will respond discreetly. Do not send confidential or time-sensitive information through this form.</p></div></section><section className="section contact-section"><div className="container contact-grid"><div><p className="eyebrow">SERVICE AREAS</p><h2>Ready when<br /><em>it matters.</em></h2><p className="contact-copy">Swan Law Firm, P.C. serves clients in California, Texas, New York, and Washington, D.C., including clients operating in government, military, space, and defense sectors.</p><div className="contact-details"><p><strong>Pro bono focus</strong><br />Military veterans and active service personnel with qualifying needs.</p><p><strong>Office</strong><br />San Francisco, California</p></div></div><form className="contact-form" onSubmit={submit}><label htmlFor="name">Name *</label><input id="name" name="name" required /><label htmlFor="email">Work email *</label><input id="email" name="email" type="email" required /><label htmlFor="matter">What can we help with?</label><select id="matter" name="matter"><option value="">Select a practice area</option><option>Government and public matters</option><option>Space, defense, and technology</option><option>Rights and public accountability</option><option>Serious dispute</option><option>Pro bono inquiry</option></select><label htmlFor="message">Brief overview</label><textarea id="message" name="message" rows={5} placeholder="Please do not include confidential details." /><input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="honeypot" /><label className="checkbox"><input type="checkbox" required /> <span>I understand this form does not create an attorney-client relationship.</span></label><button className="button button-primary" type="submit">Request a conversation →</button>{status && <p role="status">{status}</p>}</form></div></section></main>;
}
