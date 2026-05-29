"use client";

import { useMemo, useRef, useState } from "react";
import { Mail } from "lucide-react";

const POPULAR_DOMAINS = [
  // Personal email providers
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "live.com",
  "msn.com",
  "aol.com",
  "fastmail.com",
  "zoho.com",
  "yandex.com",
  "gmx.com",
  "tutanota.com",
  "duck.com",

  // MAANG + FAANG-adjacent
  "google.com",
  "googlemail.com",
  "meta.com",
  "fb.com",
  "facebook.com",
  "instagram.com",
  "whatsapp.com",
  "apple.com",
  "amazon.com",
  "aws.amazon.com",
  "netflix.com",
  "microsoft.com",
  "linkedin.com",
  "github.com",

  // Major tech
  "openai.com",
  "anthropic.com",
  "deepmind.com",
  "x.ai",
  "huggingface.co",
  "nvidia.com",
  "intel.com",
  "amd.com",
  "qualcomm.com",
  "broadcom.com",
  "micron.com",
  "tesla.com",
  "spacex.com",
  "uber.com",
  "lyft.com",
  "airbnb.com",
  "doordash.com",
  "instacart.com",
  "snap.com",
  "snapchat.com",
  "x.com",
  "twitter.com",
  "pinterest.com",
  "reddit.com",
  "discord.com",
  "spotify.com",
  "twitch.tv",
  "dropbox.com",
  "box.com",
  "slack.com",
  "zoom.us",
  "asana.com",
  "notion.so",
  "figma.com",
  "atlassian.com",
  "gitlab.com",
  "bitbucket.org",
  "jetbrains.com",
  "vercel.com",
  "cloudflare.com",
  "stripe.com",
  "shopify.com",
  "square.com",
  "block.xyz",
  "paypal.com",
  "coinbase.com",
  "robinhood.com",
  "ibm.com",
  "oracle.com",
  "salesforce.com",
  "sap.com",
  "adobe.com",
  "autodesk.com",
  "vmware.com",
  "redhat.com",
  "mongodb.com",
  "elastic.co",
  "databricks.com",
  "snowflake.com",
  "palantir.com",
  "twilio.com",
  "segment.com",
  "datadoghq.com",
  "hashicorp.com",
  "docker.com",
  "postman.com",

  // Hardware / EDA / semiconductors (relevant to portfolio)
  "samsung.com",
  "sony.com",
  "lg.com",
  "cisco.com",
  "dell.com",
  "hp.com",
  "hpe.com",
  "lenovo.com",
  "asus.com",
  "tsmc.com",
  "asml.com",
  "arm.com",
  "cadence.com",
  "synopsys.com",
  "siemens.com",
  "siemens-eda.com",
  "ansys.com",
  "mentor.com",

  // Indian tech & services
  "tcs.com",
  "infosys.com",
  "wipro.com",
  "hcl.com",
  "hcltech.com",
  "accenture.com",
  "deloitte.com",
  "capgemini.com",
  "cognizant.com",
  "techmahindra.com",
  "ltimindtree.com",
  "mphasis.com",
  "persistent.com",
  "flipkart.com",
  "myntra.com",
  "paytm.com",
  "phonepe.com",
  "razorpay.com",
  "swiggy.in",
  "zomato.com",
  "ola.com",
  "olacabs.com",
  "byjus.com",
  "freshworks.com",
  "freshdesk.com",
  "postman.co",
  "hackerrank.com",
  "hackerearth.com",
  "geeksforgeeks.org",
  "codechef.com",
  "leetcode.com",

  // Finance / consulting (recruiters often write from these)
  "jpmorgan.com",
  "jpmchase.com",
  "goldmansachs.com",
  "morganstanley.com",
  "blackrock.com",
  "citi.com",
  "barclays.com",
  "hsbc.com",
  "ubs.com",
  "wellsfargo.com",
  "bofa.com",
  "mckinsey.com",
  "bcg.com",
  "bain.com",
  "ey.com",
  "pwc.com",
  "kpmg.com",

  // Academia (catch-alls)
  "edu",
  "ac.in",
  "ac.uk",
  "iitb.ac.in",
  "iitd.ac.in",
  "iitm.ac.in",
  "iitk.ac.in",
  "iitkgp.ac.in",
  "iitr.ac.in",
  "iisc.ac.in",
  "stanford.edu",
  "mit.edu",
  "berkeley.edu",
  "cmu.edu",
  "harvard.edu",
];

function getSuggestion(value: string): string | null {
  const at = value.lastIndexOf("@");
  if (at < 0) return null;
  const local = value.slice(0, at);
  if (!local) return null;
  const after = value.slice(at + 1).toLowerCase();
  if (!after) return null;
  // Don't suggest if user already typed a TLD-ish thing (has a dot after @)
  // Actually: still suggest if their partial doesn't fully match a known domain.
  const match = POPULAR_DOMAINS.find((d) => d.startsWith(after) && d !== after);
  return match ? `${local}@${match}` : null;
}

export type EmailFieldProps = {
  label?: string;
  name?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  defaultValue?: string;
  /** Optional inline hint shown below the input while it is focused. The hint
   *  is absolutely positioned so it doesn't shift the field's height (which
   *  would misalign with sibling fields in a grid row). */
  hint?: React.ReactNode;
};

export function EmailField({
  label = "Email",
  name = "email",
  required,
  error,
  placeholder = "you@example.com",
  defaultValue = "",
  hint,
}: EmailFieldProps) {
  const id = `f-${name}`;
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestion = useMemo(() => getSuggestion(value), [value]);
  const showGhost = focused && !!suggestion;
  const ghostTail = showGhost ? suggestion.slice(value.length) : "";

  function acceptSuggestion() {
    if (!suggestion) return;
    setValue(suggestion);
    // Keep caret at the end (some input types — like `email` — don't support
    // setSelectionRange; ignore the error in that case).
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      try {
        el.setSelectionRange(suggestion.length, suggestion.length);
      } catch {
        /* unsupported on this input type */
      }
    });
  }

  return (
    <div className="relative grid gap-1.5">
      <label
        htmlFor={id}
        className="text-fg-subtle font-mono text-[11px] tracking-widest uppercase"
      >
        {label} {required && <span className="text-accent-cyan">*</span>}
      </label>
      <div className="relative">
        {/* Opaque background layer — keeps the input visually grounded while
            letting the ghost text show through (the input itself is transparent). */}
        <div
          aria-hidden
          className={`bg-bg-elev/60 pointer-events-none absolute inset-0 rounded-md border transition-colors ${
            focused
              ? "border-accent-cyan/60 bg-bg-elev ring-accent-cyan/20 ring-2"
              : "border-border"
          } ${error ? "border-accent-amber/60" : ""}`}
        />
        <Mail className="text-fg-subtle pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />

        {/* Ghost layer — sits exactly on top of the input area and prints the
            invisible typed value followed by the muted suggestion tail, so the
            tail appears inline right after the caret. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 flex items-center overflow-hidden py-2.5 pr-3 pl-10 font-sans text-sm"
        >
          <span className="invisible whitespace-pre">{value}</span>
          {showGhost && (
            <span className="text-fg-subtle/70 whitespace-pre" data-testid="email-ghost">
              {ghostTail}
            </span>
          )}
        </div>

        <input
          ref={inputRef}
          id={id}
          name={name}
          type="email"
          required={required}
          placeholder={placeholder}
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-autocomplete="inline"
          aria-describedby={hint ? `${id}-hint` : undefined}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (!suggestion) return;
            // Tab or Right-Arrow at end of input accepts the ghost suggestion.
            if (e.key === "Tab" && !e.shiftKey) {
              e.preventDefault();
              acceptSuggestion();
              return;
            }
            if (e.key === "ArrowRight") {
              // Some input types (email/number) throw when reading selection state.
              let atEnd = true;
              try {
                const el = inputRef.current;
                if (el && el.selectionStart !== null && el.selectionStart !== value.length)
                  atEnd = false;
              } catch {
                /* selection unsupported — assume caret is at end */
              }
              if (atEnd) {
                e.preventDefault();
                acceptSuggestion();
              }
            }
          }}
          className="contact-input placeholder:text-fg-subtle/60 relative z-20 w-full rounded-md border border-transparent bg-transparent py-2.5 pr-3 pl-10 text-sm outline-none focus:outline-none"
        />
      </div>
      {error && (
        <p role="alert" className="text-accent-amber font-mono text-[11px]">
          {error}
        </p>
      )}
      {hint && (
        // Render the hint as an absolutely-positioned tooltip so it never
        // changes the field's box height (which would misalign with sibling
        // fields in a `grid-cols-2` row). Only visible while focused.
        <div
          aria-hidden={!focused}
          className={
            "text-fg-subtle pointer-events-none absolute -bottom-4 left-0 truncate text-[10px] transition-opacity duration-150 " +
            (focused ? "opacity-100" : "opacity-0")
          }
        >
          <p id={`${id}-hint`}>{hint}</p>
        </div>
      )}
    </div>
  );
}

// Exported for unit testing.
export const __test = { getSuggestion, POPULAR_DOMAINS };
