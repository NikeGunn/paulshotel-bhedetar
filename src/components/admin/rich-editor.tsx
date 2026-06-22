"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useState } from "react";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Quote, LinkIcon, ImageIcon, Undo, Redo, Loader2,
} from "lucide-react";
import { uploadImage } from "@/app/actions/media";
import { cn } from "@/lib/utils";

/** Toolbar button, declared at module scope (not during render). */
function ToolbarButton({
  onClick,
  active,
  children,
  label,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-lg transition-colors",
        active ? "bg-brand-800 text-cream" : "text-brand-700 hover:bg-brand-50",
      )}
    >
      {children}
    </button>
  );
}

export function RichEditor({
  name,
  initialHTML = "",
}: {
  name: string;
  initialHTML?: string;
}) {
  const [html, setHtml] = useState(initialHTML);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
    ],
    content: initialHTML,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose-hotel min-h-[320px] max-w-none px-4 py-3 outline-none",
      },
    },
  });

  if (!editor) return null;

  const Btn = ToolbarButton;

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadImage(fd);
      if (res.url) editor?.chain().focus().setImage({ src: res.url }).run();
      else alert(res.error ?? "Upload failed.");
    } catch {
      // Network error, server crash, or image exceeded the body limit.
      alert("Upload failed. Please try again or use a smaller image.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function addLink() {
    const url = window.prompt("Link URL");
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  }

  return (
    <div className="rounded-2xl border border-brand-800/15 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-brand-800/10 p-2">
        <Btn label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></Btn>
        <Btn label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></Btn>
        <span className="mx-1 h-6 w-px bg-brand-800/10" />
        <Btn label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></Btn>
        <Btn label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></Btn>
        <span className="mx-1 h-6 w-px bg-brand-800/10" />
        <Btn label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></Btn>
        <Btn label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></Btn>
        <Btn label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></Btn>
        <span className="mx-1 h-6 w-px bg-brand-800/10" />
        <Btn label="Link" active={editor.isActive("link")} onClick={addLink}><LinkIcon className="h-4 w-4" /></Btn>
        <label className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-brand-700 hover:bg-brand-50" title="Insert image">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
          <input type="file" accept="image/*" className="hidden" onChange={onPickImage} disabled={uploading} />
        </label>
        <span className="mx-1 h-6 w-px bg-brand-800/10" />
        <Btn label="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo className="h-4 w-4" /></Btn>
        <Btn label="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo className="h-4 w-4" /></Btn>
      </div>

      <EditorContent editor={editor} />
      {/* hidden field carries the HTML to the server action */}
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
