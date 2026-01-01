"use client";

import { useMemo, useState } from "react";

type Channel = "chat" | "email" | "call";

type AutomationResponse = {
  intent: string;
  reply: string;
  time: string;
};

const channelLabels: Record<Channel, string> = {
  chat: "Chat",
  email: "Email",
  call: "Call"
};

const templates: Array<{ title: string; message: string; channel: Channel }> = [
  {
    title: "Purchase inquiry",
    message: "Hi, can you tell me the price for a bulk order of your service?",
    channel: "chat"
  },
  {
    title: "Support issue",
    message: "My dashboard won't load the analytics tab after the latest update.",
    channel: "chat"
  },
  {
    title: "Invoice follow-up",
    message: "Hello, I'm ready to pay the invoice. Can you send me a payment link?",
    channel: "email"
  },
  {
    title: "Schedule a call",
    message: "I'd love to talk to someone from sales about your enterprise plan.",
    channel: "call"
  }
];

export default function Home() {
  const [customerName, setCustomerName] = useState("Customer");
  const [channel, setChannel] = useState<Channel>("chat");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AutomationResponse[]>([]);

  const lastResponse = history.at(-1);

  const disabled = useMemo(() => !message.trim() || pending, [message, pending]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!message.trim()) return;

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          channel,
          customerName
        })
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? "Unexpected error");
      }

      const data: AutomationResponse = await response.json();
      setHistory((current) => [...current, data]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to reach automation endpoint.";
      setError(message);
    } finally {
      setPending(false);
    }
  }

  function applyTemplate(template: (typeof templates)[number]) {
    setMessage(template.message);
    setChannel(template.channel);
  }

  return (
    <main className="relative mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-12">
      <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
        <header className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            NextPlay · AI Automation
          </span>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Automate every customer touchpoint in seconds.
          </h1>
          <p className="max-w-2xl text-sm text-white/70 sm:text-base">
            Detect intent, close deals, resolve support, and trigger payments from
            a single AI-powered interface. Built for teams that need outcomes, not
            more dashboards.
          </p>
        </header>
        <div className="grid gap-4 sm:grid-cols-3">
          {templates.map((template) => (
            <button
              key={template.title}
              type="button"
              onClick={() => applyTemplate(template)}
              className="group rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-primary/40 hover:bg-primary/10"
            >
              <h3 className="text-sm font-semibold text-white group-hover:text-primary">
                {template.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-xs text-white/60">
                {template.message}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs text-accent">
                Use template →
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg"
        >
          <div>
            <label className="text-xs uppercase tracking-wide text-white/60">
              Customer name
            </label>
            <input
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Customer"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(Object.keys(channelLabels) as Channel[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setChannel(value)}
                className={[
                  "rounded-xl border px-4 py-2 text-sm transition",
                  channel === value
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/30"
                ].join(" ")}
              >
                {channelLabels[value]}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-white/60">
              Customer message
            </label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Paste a customer conversation or email..."
              rows={8}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm leading-relaxed focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={disabled}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/30"
          >
            {pending ? "Automating…" : "Run Automation"}
          </button>

          {error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : (
            <p className="text-xs text-white/50">
              Responses are powered by GPT-4o mini and adapt based on the detected
              intent.
            </p>
          )}
        </form>

        <aside className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
          <header className="flex items-center justify-between text-xs uppercase tracking-wide text-white/50">
            <span>Automation output</span>
            {lastResponse ? (
              <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] text-white/70">
                {new Date(lastResponse.time).toLocaleTimeString()}
              </span>
            ) : null}
          </header>

          {lastResponse ? (
            <div className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-6 text-sm leading-relaxed">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-3 py-1 text-xs font-semibold text-primary">
                Intent: {lastResponse.intent}
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm text-white/80">
                {lastResponse.reply}
              </pre>
            </div>
          ) : (
            <div className="flex h-full flex-col items-start justify-center gap-4 rounded-2xl border border-dashed border-white/20 bg-black/20 p-6 text-sm text-white/60">
              <p>Run an automation to preview AI-generated replies.</p>
              <p className="text-xs">
                We log your last {history.length} responses locally in this session.
              </p>
            </div>
          )}

          {history.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wide text-white/50">
                Session history
              </h3>
              <div className="space-y-2">
                {history
                  .slice()
                  .reverse()
                  .map((entry, index) => (
                    <details
                      key={[entry.intent, entry.time, index].join(":")}
                      className="group rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-white/70"
                    >
                      <summary className="cursor-pointer list-none font-semibold text-white transition group-open:text-primary">
                        {entry.intent} · {new Date(entry.time).toLocaleTimeString()}
                      </summary>
                      <pre className="mt-2 whitespace-pre-wrap text-xs text-white/70">
                        {entry.reply}
                      </pre>
                    </details>
                  ))}
              </div>
            </div>
          ) : null}
        </aside>
      </section>
    </main>
  );
}
