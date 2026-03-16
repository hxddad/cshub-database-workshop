"use client";

import { FormEvent, useState } from "react";

type FormState = {
  name: string;
  email: string;
  message: string;
};

export default function Home() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data?.error ?? "Failed to submit");
      }

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-2xl rounded-2xl bg-white p-10 shadow-lg dark:bg-zinc-950 dark:text-zinc-50">
        <h1 className="text-3xl font-semibold">Database Demo</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Send a message to see the magic happen! 
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Name</span>
              <input
                className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-white"
                type="text"
                required
                value={form.name}
                onChange={handleChange("name")}
                placeholder="Your name"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Email</span>
              <input
                className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-white"
                type="email"
                required
                value={form.email}
                onChange={handleChange("email")}
                placeholder="you@example.com"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Message</span>
            <textarea
              className="min-h-[140px] resize-none rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-white"
              required
              value={form.message}
              onChange={handleChange("message")}
              placeholder="Tell us what you're thinking..."
            />
          </label>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Submit"}
            </button>

            {status === "success" ? (
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Message sent! 🎉</p>
            ) : status === "error" ? (
              <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{error}</p>
            ) : null}
          </div>
        </form>
      </main>
    </div>
  );
}
