import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Layers3, Lightbulb } from "lucide-react";

const signals = [
  { label: "Attività del giorno", icon: CheckCircle2 },
  { label: "Percorsi di apprendimento", icon: BookOpen },
  { label: "Idee contenuto", icon: Lightbulb },
  { label: "Archivio dei pensieri", icon: Layers3 },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-wide text-zinc-50">
          Kaizen
        </Link>
        <Link
          href="/home"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-moss-400/50 hover:bg-moss-400/10"
        >
          Apri dashboard
          <ArrowRight size={16} />
        </Link>
      </nav>

      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-2xl">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.32em] text-moss-300">
            Sistema personale
          </p>
          <h1 className="text-5xl font-semibold leading-tight text-zinc-50 sm:text-6xl lg:text-7xl">
            Kaizen
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
            Una dashboard essenziale per gestire attivita quotidiane, contenuti utili,
            risorse di apprendimento, idee, libri e riflessioni personali.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/home"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-moss-400 px-5 py-3 text-sm font-semibold text-ink-950 transition hover:bg-moss-300"
            >
              Inizia a organizzare
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/archive"
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-white/25 hover:bg-white/5"
            >
              Apri archivio
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-soft backdrop-blur">
          <div className="rounded-[1.5rem] border border-white/10 bg-ink-900 p-5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Oggi</p>
                <h2 className="text-xl font-semibold text-zinc-50">Costruisci slancio</h2>
              </div>
              <span className="rounded-full bg-moss-400/15 px-3 py-1 text-sm font-medium text-moss-300">
                4 aree focus
              </span>
            </div>
            <div className="grid gap-3">
              {signals.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex size-10 items-center justify-center rounded-full bg-moss-400/10 text-moss-300">
                      <Icon size={19} />
                    </div>
                    <span className="font-medium text-zinc-100">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
