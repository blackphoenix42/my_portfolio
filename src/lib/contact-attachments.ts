/** Shared contact attachment limits — keep client merge + API route in sync. */
export const MAX_ATTACHMENTS = 5;
export const MAX_ATTACHMENT_TOTAL_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_ATTACHMENT_MIME = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
  "text/markdown",
  // Voice notes from MediaRecorder (Chrome/Firefox/Safari variants).
  "audio/webm",
  "audio/ogg",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/mp3",
] as const;

export const ALLOWED_ATTACHMENT_EXTENSIONS = [
  "pdf",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
  "docx",
  "doc",
  "txt",
  "md",
  "webm",
  "ogg",
  "mp4",
  "m4a",
  "mp3",
  "wav",
] as const;

export function isAllowedAttachment(file: { name: string; type: string }): boolean {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const extOk = (ALLOWED_ATTACHMENT_EXTENSIONS as readonly string[]).includes(ext);
  const mimeOk = (ALLOWED_ATTACHMENT_MIME as readonly string[]).includes(file.type);
  return mimeOk || extOk;
}

const AUDIO_EXTENSIONS = new Set(["webm", "ogg", "mp4", "m4a", "mp3", "wav"]);

/** True when the file is a voice-note / audio attachment (MIME or extension). */
export function isAudioAttachment(file: { name?: string; type?: string }): boolean {
  if (file.type?.startsWith("audio/")) return true;
  const ext = file.name?.split(".").pop()?.toLowerCase() ?? "";
  return AUDIO_EXTENSIONS.has(ext);
}
