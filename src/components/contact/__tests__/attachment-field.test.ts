import { describe, expect, it } from "vitest";
import { mergeAttachments } from "@/components/contact/attachment-field";

function makeFile(name: string, size = 100, type = "application/pdf"): File {
  // jsdom's File constructor will set `size` based on the content length.
  const padding = "x".repeat(Math.max(0, size));
  return new File([padding], name, { type, lastModified: 1700000000000 });
}

describe("mergeAttachments", () => {
  it("returns existing list when incoming is nullish", () => {
    const existing = [makeFile("a.pdf")];
    expect(mergeAttachments(existing, null).files).toBe(existing);
    expect(mergeAttachments(existing, undefined).files).toBe(existing);
  });

  it("merges new files into the existing list", () => {
    const existing = [makeFile("a.pdf")];
    const incoming = [makeFile("b.png", 100, "image/png")];
    const { files, error } = mergeAttachments(existing, incoming);
    expect(error).toBeUndefined();
    expect(files).toHaveLength(2);
    expect(files.map((f) => f.name)).toEqual(["a.pdf", "b.png"]);
  });

  it("dedupes files by (name, size, lastModified)", () => {
    const a = makeFile("a.pdf");
    const aDup = makeFile("a.pdf");
    const { files } = mergeAttachments([a], [aDup]);
    expect(files).toHaveLength(1);
  });

  it("flags unsupported MIME + extension", () => {
    const bad = new File(["x"], "evil.exe", { type: "application/x-msdownload" });
    const { files, error } = mergeAttachments([], [bad]);
    expect(files).toHaveLength(0);
    expect(error).toEqual({ code: "unsupported", filename: "evil.exe" });
  });

  it("accepts a known extension even when MIME type is blank", () => {
    const f = new File(["x"], "notes.md", { type: "" });
    const { files, error } = mergeAttachments([], [f]);
    expect(files).toHaveLength(1);
    expect(error).toBeUndefined();
  });

  it("rejects when count exceeds MAX_ATTACHMENTS (5)", () => {
    const existing = Array.from({ length: 5 }, (_, i) => makeFile(`f${i}.pdf`));
    const incoming = [makeFile("extra.pdf")];
    const { files, error } = mergeAttachments(existing, incoming);
    expect(files).toBe(existing);
    expect(error?.code).toBe("tooMany");
  });

  it("rejects when total bytes exceed 10 MB", () => {
    const big = makeFile("big.pdf", 11 * 1024 * 1024);
    const { files, error } = mergeAttachments([], [big]);
    expect(files).toHaveLength(0);
    expect(error?.code).toBe("tooLarge");
  });
});
