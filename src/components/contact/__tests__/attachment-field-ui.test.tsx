import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { AttachmentField } from "@/components/contact/attachment-field";

const messages = {
  contact: {
    form: {
      attachments: {
        label: "Attachments",
        dropPrompt: "Drag and drop, or <browse>click to browse</browse>",
        hint: "Up to {maxFiles} files, {maxMb} MB total.",
        remove: "Remove {filename}",
        tooMany: "Too many ({max} max)",
        tooLarge: "Too large ({maxMb} MB)",
        unsupported: "Unsupported: {filename}",
        totalSize: "{used} / {max} MB",
        dropOverlayTitle: "Drop files to attach",
      },
    },
  },
};

function wrap(ui: React.ReactNode) {
  return (
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      {ui}
    </NextIntlClientProvider>
  );
}

function pdf(name = "doc.pdf", size = 100) {
  return new File(["x".repeat(size)], name, {
    type: "application/pdf",
    lastModified: 1700000000000,
  });
}

describe("<AttachmentField />", () => {
  let createSpy: ReturnType<typeof vi.spyOn> | undefined;
  let revokeSpy: ReturnType<typeof vi.spyOn> | undefined;
  beforeEach(() => {
    if (!URL.createObjectURL)
      Object.defineProperty(URL, "createObjectURL", { value: () => "blob:fake", writable: true });
    if (!URL.revokeObjectURL)
      Object.defineProperty(URL, "revokeObjectURL", { value: () => {}, writable: true });
    createSpy = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:fake");
    revokeSpy = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  });
  afterEach(() => {
    createSpy?.mockRestore();
    revokeSpy?.mockRestore();
  });

  it("renders label, hint and 0 byte total when empty", () => {
    render(wrap(<AttachmentField files={[]} onChange={() => {}} />));
    expect(screen.getByText("Attachments")).toBeInTheDocument();
    expect(screen.getByText(/0\.00 \/ 10 MB/)).toBeInTheDocument();
  });

  it("clicking the 'click to browse' link opens the file picker", async () => {
    const user = userEvent.setup();
    render(wrap(<AttachmentField files={[]} onChange={() => {}} />));
    const input = document.getElementById("attachments") as HTMLInputElement;
    const spy = vi.spyOn(input, "click");
    await user.click(screen.getByRole("button", { name: /click to browse/i }));
    expect(spy).toHaveBeenCalled();
  });

  it("ingests files chosen via the hidden input and calls onChange", () => {
    const onChange = vi.fn();
    render(wrap(<AttachmentField files={[]} onChange={onChange} />));
    const input = document.getElementById("attachments") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [pdf("a.pdf")] } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]?.[0]).toHaveLength(1);
  });

  it("shows an inline error when the user picks an unsupported file", () => {
    render(wrap(<AttachmentField files={[]} onChange={() => {}} />));
    const input = document.getElementById("attachments") as HTMLInputElement;
    const bad = new File(["x"], "evil.exe", { type: "application/x-msdownload" });
    fireEvent.change(input, { target: { files: [bad] } });
    expect(screen.getByRole("alert")).toHaveTextContent(/unsupported.*evil\.exe/i);
  });

  it("renders one row per file with a remove button", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const initial = [pdf("a.pdf"), pdf("b.pdf")];
    render(wrap(<AttachmentField files={initial} onChange={onChange} />));
    expect(screen.getByText("a.pdf")).toBeInTheDocument();
    expect(screen.getByText("b.pdf")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /remove a\.pdf/i }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]?.[0]).toHaveLength(1);
    expect(onChange.mock.calls[0]?.[0][0].name).toBe("b.pdf");
  });

  it("creates a preview URL for image attachments and revokes it on removal", () => {
    const img = new File(["x"], "pic.png", { type: "image/png", lastModified: 1700000000000 });
    const onChange = vi.fn();
    const { rerender } = render(wrap(<AttachmentField files={[img]} onChange={onChange} />));
    expect(createSpy).toHaveBeenCalled();
    rerender(wrap(<AttachmentField files={[]} onChange={onChange} />));
    expect(revokeSpy).toHaveBeenCalledWith("blob:fake");
  });

  it("accepts a drop event and adds the files", () => {
    const onChange = vi.fn();
    render(wrap(<AttachmentField files={[]} onChange={onChange} />));
    const zone = document.getElementById("attachments")!.parentElement!;
    const file = pdf("dropped.pdf");
    fireEvent.dragOver(zone, { dataTransfer: { files: [file], types: ["Files"] } });
    fireEvent.drop(zone, { dataTransfer: { files: [file], types: ["Files"] } });
    expect(onChange).toHaveBeenCalled();
    const last = onChange.mock.calls.at(-1)?.[0];
    expect(last[0].name).toBe("dropped.pdf");
  });

  it("ignores drops when disabled", () => {
    const onChange = vi.fn();
    render(wrap(<AttachmentField files={[]} onChange={onChange} disabled />));
    const zone = document.getElementById("attachments")!.parentElement!;
    const file = pdf("nope.pdf");
    fireEvent.drop(zone, { dataTransfer: { files: [file], types: ["Files"] } });
    expect(onChange).not.toHaveBeenCalled();
  });
});
