import { describe, expect, it } from "vitest";
import { companyFromEmail, __test } from "../company-from-email";

describe("companyFromEmail", () => {
  it("returns null for free / public providers", () => {
    expect(companyFromEmail("jane@gmail.com")).toBeNull();
    expect(companyFromEmail("jane@outlook.com")).toBeNull();
    expect(companyFromEmail("jane@proton.me")).toBeNull();
    expect(companyFromEmail("JANE@YAHOO.CO.IN")).toBeNull();
  });

  it("returns null for unusable input", () => {
    expect(companyFromEmail("")).toBeNull();
    expect(companyFromEmail("not-an-email")).toBeNull();
    expect(companyFromEmail("@nodomain.com")).toBeNull();
    expect(companyFromEmail("jane@")).toBeNull();
    expect(companyFromEmail("jane@localhost")).toBeNull();
    expect(companyFromEmail("jane@ spaced.com")).toBeNull();
    expect(companyFromEmail("jane@.com")).toBeNull();
    expect(companyFromEmail("jane@domain.")).toBeNull();
  });

  it("maps well-known domains to their canonical brand name", () => {
    expect(companyFromEmail("recruiter@google.com")).toBe("Google");
    expect(companyFromEmail("hr@meta.com")).toBe("Meta");
    expect(companyFromEmail("talent@facebook.com")).toBe("Meta");
    expect(companyFromEmail("dev@nvidia.com")).toBe("NVIDIA");
    expect(companyFromEmail("x@jpmorgan.com")).toBe("JPMorgan Chase");
    expect(companyFromEmail("x@aws.amazon.com")).toBe("Amazon Web Services");
  });

  it("uses full company names for EDA / semiconductor domains", () => {
    expect(companyFromEmail("eng@cadence.com")).toBe("Cadence Design Systems");
    expect(companyFromEmail("eng@synopsys.com")).toBe("Synopsys");
    expect(companyFromEmail("eng@ti.com")).toBe("Texas Instruments");
    expect(companyFromEmail("eng@micron.com")).toBe("Micron Technology");
  });

  it("derives and title-cases unknown corporate domains", () => {
    expect(companyFromEmail("jane@acme.com")).toBe("Acme");
    expect(companyFromEmail("jane@tech-corp.io")).toBe("Tech Corp");
    expect(companyFromEmail("jane@some_startup.dev")).toBe("Some Startup");
  });

  it("strips subdomains down to the registrable label", () => {
    expect(companyFromEmail("jane@mail.acme.com")).toBe("Acme");
    expect(companyFromEmail("jane@careers.bigco.io")).toBe("Bigco");
  });

  it("handles multi-label public suffixes", () => {
    expect(companyFromEmail("jane@acme.co.uk")).toBe("Acme");
    expect(companyFromEmail("student@iitb.ac.in")).toBe("Iitb");
    expect(companyFromEmail("jane@team.acme.com.au")).toBe("Acme");
  });

  it("resolves academic .edu domains", () => {
    expect(companyFromEmail("prof@stanford.edu")).toBe("Stanford");
  });

  it("ignores one-letter registrable labels", () => {
    expect(companyFromEmail("jane@x.io")).toBeNull();
  });

  it("exposes its lookup tables for inspection", () => {
    expect(__test.FREE_PROVIDERS.has("gmail.com")).toBe(true);
    expect(__test.KNOWN["google.com"]).toBe("Google");
    expect(__test.MULTI_LABEL_TLDS.has("co.uk")).toBe(true);
    expect(__test.titleCase("foo-bar")).toBe("Foo Bar");
  });
});
