"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Paperclip, X, FileText, ImageIcon, FileType2, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export const MAX_ATTACHMENTS = 5;
export const MAX_TOTAL_BYTES = 10 * 1024 * 1024; // 10 MB
export const ACCEPTED_MIME = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
  "text/markdown",
];

const ACCEPT_ATTR = [
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".docx",
  ".doc",
  ".txt",
  ".md",
  ...ACCEPTED_MIME,
].join(",");

type Item = {
  id: string;
  file: File;
  previewUrl?: string;
};

function formatMb(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(bytes >= 1024 * 1024 ? 1 : 2);
}

function pickIcon(mime: string) {
  if (mime.startsWith("image/")) return ImageIcon;
  if (mime === "application/pdf") return FileText;
  return FileType2;
}

type ValidationError =
  | { code: "unsupported"; filename: string }
  | { code: "tooMany"; max: number }
  | { code: "tooLarge"; maxMb: number };

/** Merge new files into an existing list, applying the same per-file +
 *  aggregate validation rules used by the in-form drop zone. Returns the
 *  next list and an optional error code (no error string — callers should
 *  localize). */
export function mergeAttachments(
  existing: File[],
  incoming: FileList | File[] | null | undefined,
): { files: File[]; error?: ValidationError } {
  if (!incoming) return { files: existing };
  const list = Array.from(incoming);
  const merged: File[] = [...existing];
  let lastError: ValidationError | undefined;
  for (const f of list) {
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    const extOk = ["pdf", "png", "jpg", "jpeg", "webp", "gif", "docx", "doc", "txt", "md"].includes(
      ext,
    );
    if (!ACCEPTED_MIME.includes(f.type) && !extOk) {
      lastError = { code: "unsupported", filename: f.name };
      continue;
    }
    if (
      merged.some(
        (m) => m.name === f.name && m.size === f.size && m.lastModified === f.lastModified,
      )
    ) {
      continue;
    }
    merged.push(f);
  }
  if (merged.length > MAX_ATTACHMENTS) {
    return { files: existing, error: { code: "tooMany", max: MAX_ATTACHMENTS } };
  }
  const total = merged.reduce((s, f) => s + f.size, 0);
  if (total > MAX_TOTAL_BYTES) {
    return { files: existing, error: { code: "tooLarge", maxMb: 10 } };
  }
  return { files: merged, error: lastError };
}

export type AttachmentFieldProps = {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
};

export function AttachmentField({ files, onChange, disabled }: AttachmentFieldProps) {
  const t = useTranslations("contact.form.attachments");
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  // Mirror props -> internal items (so we can manage object URLs alongside)
  useEffect(() => {
    setItems((prev) => {
      // Revoke URLs for removed items.
      const nextIds = new Set(files.map((f) => `${f.name}:${f.size}:${f.lastModified}`));
      prev.forEach((it) => {
        if (!nextIds.has(it.id) && it.previewUrl) URL.revokeObjectURL(it.previewUrl);
      });
      return files.map((f) => {
        const id = `${f.name}:${f.size}:${f.lastModified}`;
        const existing = prev.find((p) => p.id === id);
        if (existing) return existing;
        const previewUrl = f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined;
        return { id, file: f, previewUrl };
      });
    });
  }, [files]);

  // Revoke all object URLs on unmount.
  useEffect(
    () => () => {
      items.forEach((it) => it.previewUrl && URL.revokeObjectURL(it.previewUrl));
    },
    // We intentionally only run this on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const ingest = useCallback(
    (incoming: FileList | File[] | null) => {
      const { files: next, error: err } = mergeAttachments(files, incoming);
      if (err) {
        if (err.code === "unsupported") setError(t("unsupported", { filename: err.filename }));
        else if (err.code === "tooMany") setError(t("tooMany", { max: err.max }));
        else if (err.code === "tooLarge") setError(t("tooLarge", { maxMb: err.maxMb }));
      } else {
        setError(null);
      }
      if (next !== files) onChange(next);
    },
    [files, onChange, t],
  );

  const remove = (id: string) => {
    onChange(files.filter((f) => `${f.name}:${f.size}:${f.lastModified}` !== id));
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    ingest(e.dataTransfer.files);
  };

  const totalBytes = files.reduce((s, f) => s + f.size, 0);

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="attachments"
          className="text-fg-subtle inline-flex items-center gap-1.5 font-mono text-[11px] tracking-widest uppercase"
        >
          <Paperclip className="h-3 w-3" />
          {t("label")}
        </label>
        <span className="text-fg-subtle font-mono text-[10px] tabular-nums">
          {t("totalSize", { used: formatMb(totalBytes), max: 10 })}
        </span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "border-border bg-bg-elev/40 relative rounded-lg border-2 border-dashed p-4 transition-colors",
          dragOver && "border-accent-cyan/60 bg-accent-cyan/5",
          disabled && "opacity-60",
        )}
      >
        <input
          id="attachments"
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_ATTR}
          className="sr-only"
          onChange={(e) => {
            ingest(e.target.files);
            // Allow re-selecting the same file after a remove.
            if (e.target) e.target.value = "";
          }}
          disabled={disabled}
        />

        <div className="flex items-center justify-center gap-2 py-2 text-center">
          <UploadCloud className="text-fg-subtle h-5 w-5 shrink-0" aria-hidden />
          <p className="text-fg-muted text-sm">
            {t.rich("dropPrompt", {
              browse: (chunks) => (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-accent-cyan hover:text-fg underline-offset-4 hover:underline"
                  disabled={disabled}
                >
                  {chunks}
                </button>
              ),
            })}
          </p>
        </div>
        <p className="text-fg-subtle mt-1 text-center text-[11px]">
          {t("hint", { maxFiles: MAX_ATTACHMENTS, maxMb: 10 })}
        </p>

        {items.length > 0 && (
          <ul className="border-border/60 mt-4 grid gap-2 border-t pt-3">
            {items.map((it) => {
              const Icon = pickIcon(it.file.type);
              return (
                <li
                  key={it.id}
                  className="border-border bg-bg-elev/60 flex items-center gap-3 rounded-md border p-2 text-sm"
                >
                  {it.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={it.previewUrl}
                      alt=""
                      className="border-border h-10 w-10 shrink-0 rounded border object-cover"
                    />
                  ) : (
                    <span className="border-border bg-bg-sunken text-fg-subtle grid h-10 w-10 shrink-0 place-items-center rounded border">
                      <Icon className="h-4 w-4" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-fg truncate text-sm">{it.file.name}</p>
                    <p className="text-fg-subtle font-mono text-[10px]">
                      {formatMb(it.file.size)} MB · {it.file.type || "unknown"}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={t("remove", { filename: it.file.name })}
                    onClick={() => remove(it.id)}
                    className="text-fg-subtle hover:bg-bg-sunken hover:text-fg shrink-0 rounded p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {error && (
        <p role="alert" className="text-accent-amber font-mono text-[11px]">
          {error}
        </p>
      )}
    </div>
  );
}
