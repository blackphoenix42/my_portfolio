import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { SITE } from "@/content/profile";
import { Mail, Github, Linkedin, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach out about performance engineering, AI infrastructure, developer tooling or collaboration.",
};

export default function ContactPage() {
  return (
    <div className="container-tight grid gap-12 py-16 lg:grid-cols-12">
      <header className="lg:col-span-5">
        <p className="mono-label">/ contact</p>
        <h1 className="mt-2 text-display-2 font-semibold tracking-tight">
          Let's build something measurable.
        </h1>
        <p className="mt-4 text-fg-muted">
          Open to conversations around performance engineering, AI infrastructure, developer
          tooling, EDA, backend platforms and high-impact software roles.
        </p>
        <ul className="mt-8 space-y-3 text-sm">
          <li className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-fg-subtle" />
            <a href={`mailto:${SITE.email}`} className="hover:text-accent-cyan">
              {SITE.email}
            </a>
          </li>
          <li className="flex items-center gap-3">
            <Linkedin className="h-4 w-4 text-fg-subtle" />
            <a href={SITE.linkedin} className="hover:text-accent-cyan">
              linkedin.com/in/ayushyadav
            </a>
          </li>
          <li className="flex items-center gap-3">
            <Github className="h-4 w-4 text-fg-subtle" />
            <a href={SITE.github} className="hover:text-accent-cyan">
              github.com/blackphoenix42
            </a>
          </li>
          <li className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-fg-subtle" />
            <span>{SITE.location}</span>
          </li>
          {SITE.showPhone && SITE.phone && (
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-fg-subtle" />
              <a href={`tel:${SITE.phone}`} className="hover:text-accent-cyan">
                {SITE.phone}
              </a>
            </li>
          )}
        </ul>
      </header>
      <div className="lg:col-span-7">
        <ContactForm />
      </div>
    </div>
  );
}
