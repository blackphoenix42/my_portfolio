import Link from "next/link";
import { Mail, FileDown, ArrowRight } from "lucide-react";
import { Github, Linkedin } from "@/components/icons/brand";
import { SITE } from "@/content/profile";

export function ContactCTA() {
  return (
    <section className="section" aria-label="Contact">
      <div className="container-tight">
        <div className="card relative overflow-hidden p-8 sm:p-12">
          <div
            className="bg-accent-violet/20 absolute -top-32 -right-32 h-80 w-80 rounded-full blur-3xl"
            aria-hidden
          />
          <div
            className="bg-accent-cyan/20 absolute -bottom-32 -left-32 h-80 w-80 rounded-full blur-3xl"
            aria-hidden
          />
          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mono-label">/ let's talk</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Let's build systems that scale, perform and think.
              </h2>
              <p className="text-fg-muted mt-4 max-w-lg">
                Open to conversations around performance engineering, AI infrastructure, developer
                tooling, EDA, backend platforms and high-impact software roles.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link href="/contact" className="btn-primary">
                  Start a conversation <ArrowRight className="h-4 w-4" />
                </Link>
                <a href={SITE.resumePath} download className="btn-secondary">
                  <FileDown className="h-4 w-4" /> Download Résumé
                </a>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              <ContactLink
                icon={Mail}
                label="Email"
                value={SITE.email}
                href={`mailto:${SITE.email}`}
              />
              <ContactLink
                icon={Linkedin}
                label="LinkedIn"
                value="/in/ayushyadav"
                href={SITE.linkedin}
              />
              <ContactLink
                icon={Github}
                label="GitHub"
                value="@blackphoenix42"
                href={SITE.github}
              />
              <ContactLink
                icon={FileDown}
                label="Résumé"
                value="PDF"
                href={SITE.resumePath}
                download
              />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactLink({
  icon: Icon,
  label,
  value,
  href,
  download,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
  download?: boolean;
}) {
  return (
    <li>
      <a href={href} download={download} className="card card-hover flex items-center gap-3 p-3">
        <span className="border-border bg-bg-sunken text-fg-muted rounded-md border p-2">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="text-fg-subtle block font-mono text-[10px] tracking-widest uppercase">
            {label}
          </span>
          <span className="text-fg block truncate text-sm">{value}</span>
        </span>
      </a>
    </li>
  );
}
