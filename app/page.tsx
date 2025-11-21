"use client";

import { useMemo, useState } from "react";

type Plan = {
  idea: string;
  script: {
    visual: string;
    movements: string[];
    onScreenText: string[];
    audio: string;
  };
  copy: {
    caption: string;
    cta: string;
    hashtags: string[];
  };
  publish: {
    format: string;
    title: string;
    timing: string;
    autopublish: string;
  };
};

export default function HomePage() {
  const [niche, setNiche] = useState("");
  const [trend, setTrend] = useState("");
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState("dinamico");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);

  const isValid = useMemo(() => niche.trim().length >= 2, [niche]);

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setError(null);
    setLoading(true);
    setPlan(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, trendKeyword: trend, goal, tone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Errore di generazione");
      setPlan(data as Plan);
    } catch (err: any) {
      setError(err?.message ?? "Errore imprevisto");
    } finally {
      setLoading(false);
    }
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  }

  function downloadJSON() {
    if (!plan) return;
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tiktok-plan-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <section className="card p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Agente per Video Virali su TikTok
        </h1>
        <p className="text-slate-300 mt-2">
          Inserisci i dettagli: generer? un'idea originale (?10s), script, copy e piano di pubblicazione.
        </p>

        <form onSubmit={onGenerate} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Nicchia</label>
            <input
              className="input"
              placeholder="es. fitness, tech, food..."
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              required
              minLength={2}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Trend (opzionale)</label>
            <input
              className="input"
              placeholder="es. capcut, sigma, ai..."
              value={trend}
              onChange={(e) => setTrend(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Obiettivo (opz.)</label>
            <input
              className="input"
              placeholder="es. engagement, follower, vendite..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Tono</label>
            <select
              className="input"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="dinamico">Dinamico</option>
              <option value="ironico">Ironico</option>
              <option value="motivazionale">Motivazionale</option>
              <option value="educativo">Educativo</option>
            </select>
          </div>
          <div className="md:col-span-2 flex gap-3 pt-2">
            <button className="btn-primary" disabled={!isValid || loading} type="submit">
              {loading ? "Generazione..." : "Genera piano"}
            </button>
            {plan && (
              <>
                <button
                  type="button"
                  className="btn-primary bg-slate-700 hover:brightness-110"
                  onClick={() => copyText(`${plan.copy.caption} ${plan.copy.hashtags.join(" ")}`)}
                >
                  Copia caption+hashtag
                </button>
                <button
                  type="button"
                  className="btn-primary bg-slate-700 hover:brightness-110"
                  onClick={downloadJSON}
                >
                  Scarica JSON
                </button>
              </>
            )}
          </div>
          {error && (
            <div className="md:col-span-2 text-red-300 text-sm">{error}</div>
          )}
        </form>
      </section>

      {plan && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-semibold">1) Idea</h2>
            <p className="text-slate-200">{plan.idea}</p>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-semibold">2) Script (?10s)</h2>
            <div>
              <p className="text-slate-300 text-sm">Contenuto visivo</p>
              <p className="text-slate-200">{plan.script.visual}</p>
            </div>
            <div>
              <p className="text-slate-300 text-sm">Movimenti/Transizioni</p>
              <ul className="list-disc pl-5 text-slate-200">
                {plan.script.movements.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-slate-300 text-sm">Testi on-screen</p>
              <ul className="list-disc pl-5 text-slate-200">
                {plan.script.onScreenText.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-slate-300 text-sm">Musica/Audio</p>
              <p className="text-slate-200">{plan.script.audio}</p>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-semibold">3) Copy del post</h2>
            <div>
              <p className="text-slate-300 text-sm">Caption</p>
              <p className="text-slate-200">{plan.copy.caption}</p>
            </div>
            <div>
              <p className="text-slate-300 text-sm">Call to action</p>
              <p className="text-slate-200">{plan.copy.cta}</p>
            </div>
            <div>
              <p className="text-slate-300 text-sm">Hashtag</p>
              <p className="text-slate-200">{plan.copy.hashtags.join(" ")}</p>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-semibold">4) Pubblicazione</h2>
            <div className="grid grid-cols-1 gap-2 text-slate-200">
              <p><span className="text-slate-300">Formato:</span> {plan.publish.format}</p>
              <p><span className="text-slate-300">Titolo suggerito:</span> {plan.publish.title}</p>
              <p><span className="text-slate-300">Timing:</span> {plan.publish.timing}</p>
              <p className="text-slate-300">Auto-pubblicazione</p>
              <p className="text-slate-200">{plan.publish.autopublish}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
