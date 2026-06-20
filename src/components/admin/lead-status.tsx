"use client";

import { useTransition } from "react";
import { setInquiryStatus } from "@/app/actions/leads";

const OPTIONS: { value: "new" | "contacted" | "closed"; label: string; cls: string }[] = [
  { value: "new", label: "New", cls: "bg-amber-100 text-amber-700" },
  { value: "contacted", label: "Contacted", cls: "bg-blue-100 text-blue-700" },
  { value: "closed", label: "Closed", cls: "bg-gray-100 text-gray-600" },
];

export function LeadStatus({
  id,
  status,
}: {
  id: string;
  status: "new" | "contacted" | "closed";
}) {
  const [pending, start] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) =>
        start(() =>
          setInquiryStatus(id, e.target.value as "new" | "contacted" | "closed"),
        )
      }
      className={`rounded-full px-3 py-1 text-xs font-medium outline-none ${
        OPTIONS.find((o) => o.value === status)?.cls
      }`}
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
