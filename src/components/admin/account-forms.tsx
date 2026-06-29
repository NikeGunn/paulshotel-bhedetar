"use client";

import { useActionState } from "react";
import { Loader2, Check, AlertCircle, KeyRound, AtSign, User, ShieldOff } from "lucide-react";
import {
  changePassword,
  changeLoginEmail,
  updateProfile,
  signOutEverywhere,
  type AccountFormState,
} from "@/app/actions/account";

const field =
  "mt-1.5 w-full rounded-xl border border-brand-800/15 bg-white px-4 py-2.5 text-brand-900 outline-none transition-colors focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30";
const label = "text-sm font-medium text-brand-800";

function Status({ state }: { state: AccountFormState }) {
  if (state.error)
    return (
      <p className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
        <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
      </p>
    );
  if (state.ok)
    return (
      <p className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
        <Check className="h-4 w-4 shrink-0" /> {state.message}
      </p>
    );
  return null;
}

function Card({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-brand-800/10 bg-white p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold text-brand-900">{title}</h2>
          <p className="text-sm text-muted">{desc}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SubmitBtn({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-brand-800 px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-brand-900 disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

export function ProfileCard({ displayName }: { displayName: string }) {
  const [state, action, pending] = useActionState<AccountFormState, FormData>(
    updateProfile,
    {},
  );
  return (
    <Card icon={User} title="Profile" desc="Your display name inside the admin panel.">
      <form action={action}>
        <label className={label} htmlFor="display_name">
          Display name
        </label>
        <input
          id="display_name"
          name="display_name"
          defaultValue={displayName}
          placeholder="e.g. Paul"
          className={field}
        />
        <Status state={state} />
        <SubmitBtn pending={pending}>Save profile</SubmitBtn>
      </form>
    </Card>
  );
}

export function PasswordCard() {
  const [state, action, pending] = useActionState<AccountFormState, FormData>(
    changePassword,
    {},
  );
  return (
    <Card
      icon={KeyRound}
      title="Change password"
      desc="You must enter your current password to set a new one."
    >
      <form action={action} className="space-y-4">
        <div>
          <label className={label} htmlFor="current">
            Current password
          </label>
          <input id="current" name="current" type="password" autoComplete="current-password" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="next">
            New password
          </label>
          <input id="next" name="next" type="password" autoComplete="new-password" className={field} />
          <p className="mt-1 text-xs text-muted">At least 8 characters.</p>
        </div>
        <div>
          <label className={label} htmlFor="confirm">
            Confirm new password
          </label>
          <input id="confirm" name="confirm" type="password" autoComplete="new-password" className={field} />
        </div>
        <Status state={state} />
        <SubmitBtn pending={pending}>Update password</SubmitBtn>
      </form>
    </Card>
  );
}

export function EmailCard({ currentEmail }: { currentEmail: string }) {
  const [state, action, pending] = useActionState<AccountFormState, FormData>(
    changeLoginEmail,
    {},
  );
  return (
    <Card
      icon={AtSign}
      title="Change login email"
      desc={`You currently sign in with ${currentEmail}.`}
    >
      <form action={action} className="space-y-4">
        <div>
          <label className={label} htmlFor="email">
            New login email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="email-current-pw">
            Current password (to confirm)
          </label>
          <input id="email-current-pw" name="current" type="password" autoComplete="current-password" className={field} />
        </div>
        <Status state={state} />
        <SubmitBtn pending={pending}>Change email</SubmitBtn>
      </form>
    </Card>
  );
}

export function SessionsCard() {
  const [state, action, pending] = useActionState<AccountFormState, FormData>(
    async () => signOutEverywhere(),
    {},
  );
  return (
    <Card
      icon={ShieldOff}
      title="Sessions"
      desc="Sign out of every device. You will need to sign in again."
    >
      <form action={action}>
        <Status state={state} />
        <button
          type="submit"
          disabled={pending}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-full border border-red-300 bg-red-50 px-6 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldOff className="h-4 w-4" />}
          Sign out everywhere
        </button>
      </form>
    </Card>
  );
}
