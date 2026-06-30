"use client";

import { useState, useTransition, useEffect } from "react";
import { useActionState } from "react";
import NextImage from "next/image";
import { Loader2, Check, AlertCircle, Plus, Pencil, Trash2, Save, X, Star } from "lucide-react";
import { ImagePicker } from "./image-picker";
import {
  saveRoom,
  saveDish,
  saveExperience,
  saveTestimonial,
  deleteContent,
  type ContentFormState,
} from "@/app/actions/content";
import type { Room, Dish, Experience, Testimonial } from "@/lib/content-data";

type Table = "rooms" | "dishes" | "experiences" | "testimonials";

const field =
  "mt-1.5 w-full rounded-xl border border-brand-800/15 bg-white px-4 py-2.5 text-brand-900 outline-none transition-colors focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30";
const label = "text-sm font-medium text-brand-800";

const tabs: { key: Table; label: string }[] = [
  { key: "rooms", label: "Rooms" },
  { key: "dishes", label: "Dishes" },
  { key: "experiences", label: "Experiences" },
  { key: "testimonials", label: "Testimonials" },
];

export function ContentManager({
  rooms,
  dishes,
  experiences,
  testimonials,
}: {
  rooms: Room[];
  dishes: Dish[];
  experiences: Experience[];
  testimonials: Testimonial[];
}) {
  const [tab, setTab] = useState<Table>("rooms");

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.key
                ? "bg-brand-800 text-cream"
                : "bg-white text-brand-700 ring-1 ring-brand-800/10 hover:bg-brand-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "rooms" && <RoomsPanel items={rooms} />}
        {tab === "dishes" && <DishesPanel items={dishes} />}
        {tab === "experiences" && <ExperiencesPanel items={experiences} />}
        {tab === "testimonials" && <TestimonialsPanel items={testimonials} />}
      </div>
    </div>
  );
}

// ---- shared bits -----------------------------------------------------------
/** Close the inline form shortly after a successful save (lets the user see the
 * confirmation first). One place for the behaviour across all four forms. */
function useCloseOnSuccess(ok: boolean | undefined, onSaved: () => void) {
  useEffect(() => {
    if (!ok) return;
    const t = setTimeout(onSaved, 700);
    return () => clearTimeout(t);
  }, [ok, onSaved]);
}

function Feedback({ state }: { state: ContentFormState }) {
  if (state.error)
    return (
      <p className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
        <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
      </p>
    );
  if (state.ok)
    return (
      <p className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
        <Check className="h-4 w-4 shrink-0" /> Saved. Your site updates within a minute.
      </p>
    );
  return null;
}

function SaveBtn({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full bg-brand-800 px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-brand-900 disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Save
    </button>
  );
}

function DeleteBtn({ table, id }: { table: Table; id?: string }) {
  const [pending, start] = useTransition();
  if (!id) return null;
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this item? This cannot be undone.")) return;
        start(async () => {
          await deleteContent(table, id);
        });
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      Delete
    </button>
  );
}

function Thumb({ src }: { src?: string }) {
  if (!src) return <div className="h-14 w-20 shrink-0 rounded-lg bg-brand-100" />;
  return (
    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-brand-100">
      <NextImage src={src} alt="" fill className="object-cover" sizes="80px" />
    </div>
  );
}

/** A row that toggles between a summary and an inline edit form. */
function EditableRow({
  summary,
  form,
}: {
  summary: React.ReactNode;
  form: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <li className="rounded-2xl border border-brand-800/10 bg-white p-4">
      {open ? (
        <div>
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand-700"
            >
              <X className="h-4 w-4" /> Close
            </button>
          </div>
          {form(() => setOpen(false))}
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">{summary}</div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
          >
            <Pencil className="h-4 w-4" /> Edit
          </button>
        </div>
      )}
    </li>
  );
}

/** "Add new" disclosure that reuses the same form. */
function AddNew({ children }: { children: (close: () => void) => React.ReactNode }) {
  const [open, setOpen] = useState(false);
  if (!open)
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-brand-950 transition-transform hover:-translate-y-0.5"
      >
        <Plus className="h-4 w-4" /> Add new
      </button>
    );
  return (
    <div className="rounded-2xl border border-amber-300/40 bg-amber-50/40 p-4">
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand-700"
        >
          <X className="h-4 w-4" /> Cancel
        </button>
      </div>
      {children(() => setOpen(false))}
    </div>
  );
}

// ---- ROOMS -----------------------------------------------------------------
function RoomForm({ item, onSaved }: { item?: Room; onSaved: () => void }) {
  const [state, action, pending] = useActionState<ContentFormState, FormData>(saveRoom, {});
  useCloseOnSuccess(state.ok, onSaved);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      {item?.id && <input type="hidden" name="id" value={item.id} />}
      <div>
        <label className={label}>Name</label>
        <input name="name" defaultValue={item?.name} className={field} required />
      </div>
      <div>
        <label className={label}>Price from</label>
        <input name="price_from" defaultValue={item?.priceFrom} placeholder="Rs. 1,500" className={field} />
      </div>
      <div>
        <label className={label}>Capacity</label>
        <input name="capacity" defaultValue={item?.capacity} placeholder="2 guests" className={field} />
      </div>
      <div>
        <label className={label}>Slug (optional)</label>
        <input name="slug" defaultValue={item?.slug} placeholder="auto from name" className={field} />
      </div>
      <div className="sm:col-span-2">
        <label className={label}>Description</label>
        <textarea name="blurb" rows={3} defaultValue={item?.blurb} className={field} />
      </div>
      <div className="sm:col-span-2">
        <label className={label}>Amenities (comma separated)</label>
        <input
          name="amenities"
          defaultValue={item?.amenities.join(", ")}
          placeholder="Mountain view, Private bathroom, Free Wi-Fi"
          className={field}
        />
      </div>
      <div className="sm:col-span-2">
        <label className={label}>Photo</label>
        <ImagePicker name="image" initialUrl={item?.image ?? ""} />
      </div>
      <Feedback state={state} />
      <div className="sm:col-span-2 flex items-center gap-3">
        <SaveBtn pending={pending} />
        <DeleteBtn table="rooms" id={item?.id} />
      </div>
    </form>
  );
}

function RoomsPanel({ items }: { items: Room[] }) {
  return (
    <div className="space-y-4">
      <AddNew>{(close) => <RoomForm onSaved={close} />}</AddNew>
      <ul className="space-y-3">
        {items.map((r) => (
          <EditableRow
            key={r.id ?? r.slug}
            summary={
              <>
                <Thumb src={r.image} />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-brand-900">{r.name}</p>
                  <p className="truncate text-sm text-muted">
                    {r.priceFrom} · {r.capacity}
                  </p>
                </div>
              </>
            }
            form={(close) => <RoomForm item={r} onSaved={close} />}
          />
        ))}
      </ul>
    </div>
  );
}

// ---- DISHES ----------------------------------------------------------------
function DishForm({ item, onSaved }: { item?: Dish; onSaved: () => void }) {
  const [state, action, pending] = useActionState<ContentFormState, FormData>(saveDish, {});
  useCloseOnSuccess(state.ok, onSaved);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      {item?.id && <input type="hidden" name="id" value={item.id} />}
      <div>
        <label className={label}>Name</label>
        <input name="name" defaultValue={item?.name} className={field} required />
      </div>
      <div className="sm:col-span-2">
        <label className={label}>Photo</label>
        <ImagePicker name="src" initialUrl={item?.src ?? ""} />
      </div>
      <Feedback state={state} />
      <div className="sm:col-span-2 flex items-center gap-3">
        <SaveBtn pending={pending} />
        <DeleteBtn table="dishes" id={item?.id} />
      </div>
    </form>
  );
}

function DishesPanel({ items }: { items: Dish[] }) {
  return (
    <div className="space-y-4">
      <AddNew>{(close) => <DishForm onSaved={close} />}</AddNew>
      <ul className="space-y-3">
        {items.map((d) => (
          <EditableRow
            key={d.id ?? d.name}
            summary={
              <>
                <Thumb src={d.src} />
                <p className="truncate font-semibold text-brand-900">{d.name}</p>
              </>
            }
            form={(close) => <DishForm item={d} onSaved={close} />}
          />
        ))}
      </ul>
    </div>
  );
}

// ---- EXPERIENCES -----------------------------------------------------------
function ExperienceForm({ item, onSaved }: { item?: Experience; onSaved: () => void }) {
  const [state, action, pending] = useActionState<ContentFormState, FormData>(saveExperience, {});
  useCloseOnSuccess(state.ok, onSaved);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      {item?.id && <input type="hidden" name="id" value={item.id} />}
      <div className="sm:col-span-2">
        <label className={label}>Title</label>
        <input name="title" defaultValue={item?.title} className={field} required />
      </div>
      <div className="sm:col-span-2">
        <label className={label}>Description</label>
        <textarea name="body" rows={3} defaultValue={item?.text} className={field} />
      </div>
      <div className="sm:col-span-2">
        <label className={label}>Photo</label>
        <ImagePicker name="image" initialUrl={item?.image ?? ""} />
      </div>
      <Feedback state={state} />
      <div className="sm:col-span-2 flex items-center gap-3">
        <SaveBtn pending={pending} />
        <DeleteBtn table="experiences" id={item?.id} />
      </div>
    </form>
  );
}

function ExperiencesPanel({ items }: { items: Experience[] }) {
  return (
    <div className="space-y-4">
      <AddNew>{(close) => <ExperienceForm onSaved={close} />}</AddNew>
      <ul className="space-y-3">
        {items.map((e) => (
          <EditableRow
            key={e.id ?? e.title}
            summary={
              <>
                <Thumb src={e.image} />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-brand-900">{e.title}</p>
                  <p className="truncate text-sm text-muted">{e.text}</p>
                </div>
              </>
            }
            form={(close) => <ExperienceForm item={e} onSaved={close} />}
          />
        ))}
      </ul>
    </div>
  );
}

// ---- TESTIMONIALS ----------------------------------------------------------
function TestimonialForm({ item, onSaved }: { item?: Testimonial; onSaved: () => void }) {
  const [state, action, pending] = useActionState<ContentFormState, FormData>(saveTestimonial, {});
  useCloseOnSuccess(state.ok, onSaved);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      {item?.id && <input type="hidden" name="id" value={item.id} />}
      <div>
        <label className={label}>Guest name</label>
        <input name="name" defaultValue={item?.name} className={field} required />
      </div>
      <div>
        <label className={label}>Location</label>
        <input name="location" defaultValue={item?.location} placeholder="Dharan" className={field} />
      </div>
      <div>
        <label className={label}>Rating (1–5)</label>
        <input
          name="rating"
          type="number"
          min={1}
          max={5}
          defaultValue={item?.rating ?? 5}
          className={field}
          required
        />
      </div>
      <div className="sm:col-span-2">
        <label className={label}>Review text</label>
        <textarea name="body" rows={3} defaultValue={item?.text} className={field} required />
      </div>
      <Feedback state={state} />
      <div className="sm:col-span-2 flex items-center gap-3">
        <SaveBtn pending={pending} />
        <DeleteBtn table="testimonials" id={item?.id} />
      </div>
    </form>
  );
}

function TestimonialsPanel({ items }: { items: Testimonial[] }) {
  return (
    <div className="space-y-4">
      <AddNew>{(close) => <TestimonialForm onSaved={close} />}</AddNew>
      <ul className="space-y-3">
        {items.map((t) => (
          <EditableRow
            key={t.id ?? t.name}
            summary={
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-semibold text-brand-900">
                  {t.name}
                  <span className="inline-flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </span>
                </p>
                <p className="truncate text-sm text-muted">{t.text}</p>
              </div>
            }
            form={(close) => <TestimonialForm item={t} onSaved={close} />}
          />
        ))}
      </ul>
    </div>
  );
}
