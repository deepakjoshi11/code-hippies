"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import { leadSchema, type LeadInput } from "@/lib/schemas";
import { budgetBands, projectTypes, timelineBands } from "@/data/pricing";
import { Button } from "@/components/ui/button";
import { site, whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 0, label: "Project", fields: ["projectType"] },
  { id: 1, label: "Budget & timeline", fields: ["budget", "timeline"] },
  { id: 2, label: "Details", fields: ["name", "email", "company", "message"] },
] as const;

export function LeadForm({ defaultEngagement }: { defaultEngagement?: string }) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [csrf, setCsrf] = useState<string | null>(null);
  const [messageLength, setMessageLength] = useState(0);
  const headingRef = useRef<HTMLParagraphElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: defaultEngagement ? `I'm interested in the ${defaultEngagement} engagement model. ` : "",
      website: "",
    },
  });

  useEffect(() => {
    fetch("/api/csrf")
      .then((r) => r.json())
      .then((d: { token?: string }) => setCsrf(d.token ?? null))
      .catch(() => setCsrf(null));
  }, []);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const messageField = register("message");

  const goNext = async () => {
    const fields = STEPS[step]!.fields;
    const valid = await trigger(fields as unknown as (keyof LeadInput)[]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(csrf ? { "x-csrf-token": csrf } : {}),
        },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok) {
        setServerError(data.error ?? "Something went wrong. Please try WhatsApp instead.");
        return;
      }
      setDone(true);
    } catch {
      setServerError("Could not send that. The WhatsApp button always works.");
    } finally {
      setSubmitting(false);
    }
  });

  if (done) {
    return (
      <div
        role="status"
        className="rounded-card border border-brand-400/25 bg-brand-500/6 p-8 text-center md:p-12"
      >
        <CheckCircle2 className="mx-auto size-10 text-brand-400" aria-hidden="true" />
        <h2 className="mt-5 text-2xl font-semibold text-ink-50">Brief received.</h2>
        <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink-300">
          You&rsquo;ll get a reply within one business day — either with questions, or with a proposed
          time for a discovery call. If it is urgent, WhatsApp is faster.
        </p>
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-ink-950"
        >
          {site.whatsappLabel}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-7">
      <ol className="flex items-center gap-2" aria-label="Form progress">
        {STEPS.map((s) => (
          <li key={s.id} className="flex flex-1 flex-col gap-2">
            <span
              aria-hidden="true"
              className={cn(
                "h-1 rounded-full transition-colors duration-300",
                s.id <= step ? "bg-brand-400" : "bg-ink-100/12",
              )}
            />
            <span
              className={cn(
                "text-xs transition-colors",
                s.id === step ? "text-ink-100" : "text-ink-500",
              )}
            >
              {s.label}
            </span>
          </li>
        ))}
      </ol>

      <p ref={headingRef} tabIndex={-1} className="sr-only" aria-live="polite">
        Step {step + 1} of {STEPS.length}: {STEPS[step]!.label}
      </p>

      {/* Honeypot: positioned off-screen, hidden from assistive tech and tab order. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website (leave blank)</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      {step === 0 ? (
        <Fieldset legend="What kind of project is this?">
          <RadioGroup
            name="projectType"
            options={projectTypes}
            register={register}
            error={errors.projectType?.message}
          />
        </Fieldset>
      ) : null}

      {step === 1 ? (
        <>
          <Fieldset
            legend="What budget band are you working with?"
            hint="This is not a commitment — it tells me what is realistic to propose."
          >
            <RadioGroup
              name="budget"
              options={budgetBands}
              register={register}
              error={errors.budget?.message}
            />
          </Fieldset>
          <Fieldset legend="When do you need this?">
            <RadioGroup
              name="timeline"
              options={timelineBands}
              register={register}
              error={errors.timeline?.message}
            />
          </Fieldset>
        </>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-5">
          <Field label="Your name" error={errors.name?.message} required>
            <input
              type="text"
              autoComplete="name"
              className={inputClass}
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
          </Field>
          <Field label="Email" error={errors.email?.message} required>
            <input
              type="email"
              autoComplete="email"
              inputMode="email"
              className={inputClass}
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </Field>
          <Field label="Company" error={errors.company?.message} optional>
            <input
              type="text"
              autoComplete="organization"
              className={inputClass}
              {...register("company")}
            />
          </Field>
          <Field
            label="What are you building?"
            error={errors.message?.message}
            required
            hint="What it has to do, who uses it, and anything that already exists and cannot change."
          >
            <textarea
              rows={6}
              className={cn(inputClass, "resize-y")}
              aria-invalid={Boolean(errors.message)}
              {...messageField}
              onChange={(event) => {
                setMessageLength(event.target.value.length);
                void messageField.onChange(event);
              }}
            />
            <p className="mt-1.5 text-right text-xs text-ink-500" aria-hidden="true">
              {messageLength} / 4000
            </p>
          </Field>
        </div>
      ) : null}

      {serverError ? (
        <p role="alert" className="rounded-xl border border-accent-600/30 bg-accent-600/8 px-4 py-3 text-sm text-accent-400">
          {serverError}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-3 border-t border-ink-100/10 pt-6">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft aria-hidden="true" /> Back
          </Button>
        ) : (
          <span />
        )}

        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={() => void goNext()}>
            Continue <ArrowRight aria-hidden="true" />
          </Button>
        ) : (
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" /> Sending…
              </>
            ) : (
              <>
                Send the brief <ArrowRight aria-hidden="true" />
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-ink-100/12 bg-ink-900/60 px-4 py-3 text-[0.95rem] text-ink-50 placeholder:text-ink-500 transition-colors focus:border-brand-400/50 focus:outline-none aria-[invalid=true]:border-accent-600/60";

function Fieldset({
  legend,
  hint,
  children,
}: {
  legend: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="text-lg font-medium text-ink-50">{legend}</legend>
      {hint ? <p className="text-sm text-ink-500">{hint}</p> : null}
      {children}
    </fieldset>
  );
}

function RadioGroup({
  name,
  options,
  register,
  error,
}: {
  name: "projectType" | "budget" | "timeline";
  options: readonly string[];
  register: ReturnType<typeof useForm<LeadInput>>["register"];
  error?: string;
}) {
  return (
    <>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink-100/12 px-4 py-3 text-sm text-ink-200 transition-colors hover:border-ink-100/25 has-[:checked]:border-brand-400/50 has-[:checked]:bg-brand-500/8 has-[:checked]:text-ink-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand-400"
          >
            <input
              type="radio"
              value={option}
              className="size-4 accent-[oklch(0.7_0.16_165)]"
              {...register(name)}
            />
            {option}
          </label>
        ))}
      </div>
      {error ? (
        <p role="alert" className="text-sm text-accent-400">
          {error}
        </p>
      ) : null}
    </>
  );
}

function Field({
  label,
  error,
  hint,
  required,
  optional,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-baseline gap-2 text-sm font-medium text-ink-100">
        {label}
        {required ? (
          <span className="text-accent-400" aria-hidden="true">
            *
          </span>
        ) : null}
        {optional ? <span className="text-xs font-normal text-ink-500">optional</span> : null}
      </span>
      {hint ? <span className="text-xs leading-relaxed text-ink-500">{hint}</span> : null}
      {children}
      {error ? (
        <span role="alert" className="text-sm text-accent-400">
          {error}
        </span>
      ) : null}
    </label>
  );
}
