"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

type Img = { src: string; alt: string; category: string };

export function GalleryGrid({ images }: { images: Img[] }) {
  const categories = ["All", ...Array.from(new Set(images.map((i) => i.category)))];
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<Img | null>(null);

  const shown =
    active === "All" ? images : images.filter((i) => i.category === active);

  return (
    <>
      {/* Filter pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              active === c
                ? "bg-brand-800 text-cream"
                : "bg-white text-brand-800 hover:bg-brand-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Masonry-ish grid */}
      <motion.div layout className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
        <AnimatePresence>
          {shown.map((img) => (
            <motion.button
              key={img.src}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              onClick={() => setLightbox(img)}
              className="group block w-full break-inside-avoid overflow-hidden rounded-2xl shadow-sm"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={500}
                height={500}
                sizes="(max-width: 768px) 50vw, 25vw"
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[60] grid place-items-center bg-brand-950/90 p-4 backdrop-blur-sm"
          >
            <button
              aria-label="Close"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-cream/10 text-cream hover:bg-cream/20"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[85vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightbox.src}
                alt={lightbox.alt}
                width={1200}
                height={900}
                className="mx-auto h-auto max-h-[85vh] w-auto rounded-2xl object-contain"
              />
              <p className="mt-3 text-center text-sm text-cream/80">{lightbox.alt}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
