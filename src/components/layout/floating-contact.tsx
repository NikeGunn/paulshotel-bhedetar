"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, MessageCircle, X, Plus } from "lucide-react";
import { links } from "@/lib/site-config";

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3"
        >
          <AnimatePresence>
            {open && (
              <>
                <motion.a
                  key="wa"
                  href={links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 12, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.8 }}
                  transition={{ delay: 0.05 }}
                  className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-white shadow-lg"
                >
                  <MessageCircle className="h-5 w-5" /> WhatsApp
                </motion.a>
                <motion.a
                  key="call"
                  href={links.call}
                  initial={{ opacity: 0, y: 12, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.8 }}
                  className="flex items-center gap-2 rounded-full bg-brand-700 px-4 py-3 font-semibold text-cream shadow-lg"
                >
                  <Phone className="h-5 w-5" /> Call
                </motion.a>
              </>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Contact options"
            className="grid h-14 w-14 place-items-center rounded-full bg-amber-400 text-brand-950 shadow-xl ring-4 ring-amber-400/25 transition-transform hover:scale-105"
          >
            <motion.span animate={{ rotate: open ? 135 : 0 }}>
              {open ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
            </motion.span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
