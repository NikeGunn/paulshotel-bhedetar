"use client";

import { useState } from "react";
import NextImage from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { uploadImage } from "@/app/actions/media";

export function ImagePicker({
  name,
  initialUrl = "",
}: {
  name: string;
  initialUrl?: string;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadImage(fd);
      if (res.url) setUrl(res.url);
      else setError(res.error ?? "Upload failed.");
    } catch {
      // Network error or the request exceeded the Server Action body limit.
      setError("Upload failed — the image may be too large. Try a smaller photo.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={url} />
      {url ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-brand-800/15">
          <NextImage src={url} alt="Cover" fill className="object-cover" sizes="600px" />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-brand-950/70 text-cream"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-brand-800/25 bg-brand-50/40 text-brand-600 hover:bg-brand-50">
          {busy ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <Upload className="h-6 w-6" />
              <span className="text-sm font-medium">Upload cover image</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={onPick} disabled={busy} />
        </label>
      )}
      {error && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
    </div>
  );
}
