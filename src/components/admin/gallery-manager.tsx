"use client";

import { useState, useTransition } from "react";
import NextImage from "next/image";
import { Loader2, Upload, Trash2, Pencil, Check, X } from "lucide-react";
import {
  uploadImage,
  addGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,
} from "@/app/actions/media";

type Img = { id: string; url: string; alt: string; category: string };
const CATEGORIES = ["Hotel", "Rooms", "Food", "Bar", "Views"];

export function GalleryManager({ images }: { images: Img[] }) {
  const [busy, setBusy] = useState(false);
  const [category, setCategory] = useState("Hotel");
  const [alt, setAlt] = useState("");
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState<string | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editCategory, setEditCategory] = useState("Hotel");

  function beginEdit(img: Img) {
    setEditing(img.id);
    setEditAlt(img.alt);
    setEditCategory(img.category);
  }

  function saveEdit(id: string) {
    start(async () => {
      await updateGalleryImage(id, { alt: editAlt, category: editCategory });
      setEditing(null);
    });
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const up = new FormData();
      up.append("file", file);
      const res = await uploadImage(up);
      if (res.url) {
        const fd = new FormData();
        fd.append("url", res.url);
        fd.append("alt", alt || file.name);
        fd.append("category", category);
        await addGalleryImage(fd);
        setAlt("");
      } else {
        alert(res.error ?? "Upload failed.");
      }
    } catch {
      alert("Upload failed — the image may be too large. Try a smaller photo.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  const field =
    "rounded-xl border border-brand-800/15 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400";

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-brand-800/10 bg-white p-5">
        <div>
          <label className="block text-xs font-medium text-muted">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${field} mt-1`}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted">Alt text (for SEO)</label>
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Describe the photo"
            className={`${field} mt-1 w-full`}
          />
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-800 px-5 py-2.5 font-semibold text-cream hover:bg-brand-900">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload photo
          <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={busy} />
        </label>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.length === 0 && (
          <p className="col-span-full py-10 text-center text-muted">
            No gallery images yet. Upload your first photo above.
          </p>
        )}
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-brand-800/10">
            <NextImage src={img.url} alt={img.alt} fill sizes="240px" className="object-cover" />
            <span className="absolute left-2 top-2 rounded-full bg-brand-950/70 px-2 py-0.5 text-[10px] font-medium text-cream">
              {img.category}
            </span>

            {editing === img.id ? (
              <div className="absolute inset-0 flex flex-col gap-2 bg-brand-950/85 p-3 text-cream">
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="rounded-lg bg-white/95 px-2 py-1.5 text-xs text-brand-900 outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <textarea
                  value={editAlt}
                  onChange={(e) => setEditAlt(e.target.value)}
                  placeholder="Alt text"
                  className="flex-1 resize-none rounded-lg bg-white/95 px-2 py-1.5 text-xs text-brand-900 outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(img.id)}
                    disabled={pending}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-amber-400 px-2 py-1.5 text-xs font-semibold text-brand-950 disabled:opacity-60"
                  >
                    {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="inline-flex items-center justify-center rounded-lg bg-white/15 px-2.5 py-1.5 text-xs"
                    aria-label="Cancel"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => beginEdit(img)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-brand-950/80 text-cream"
                  aria-label="Edit image details"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this image?")) start(() => deleteGalleryImage(img.id));
                  }}
                  disabled={pending}
                  className="grid h-8 w-8 place-items-center rounded-full bg-red-600/90 text-white"
                  aria-label="Delete image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
