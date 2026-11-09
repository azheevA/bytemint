import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the ByteMint team with feedback, bug reports or suggestions for new developer tools.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="container inner-page contact-page">
      <div className="page-heading">
        <span className="eyebrow">CONTACT / SAY HELLO</span>
        <h1>
          Have a good
          <br />
          <span>idea or a question?</span>
        </h1>
        <p>
          Tell us what would make ByteMint more useful. Bug reports and
          practical suggestions are always welcome.
        </p>
      </div>
      <div className="contact-layout">
        <div className="contact-aside">
          <span className="contact-aside-icon">↗</span>
          <h2>Let&apos;s make the toolbox better.</h2>
          <p>
            Use the form for feedback, tool requests, partnership questions or
            bug reports. Please do not include passwords, API keys or other
            secrets.
          </p>
          <div className="contact-aside-line" />
        </div>
        <div className="contact-form-wrap">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
