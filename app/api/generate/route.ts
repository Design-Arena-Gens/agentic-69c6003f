import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
  niche: string;
  trendKeyword?: string;
  goal?: string;
  tone?: string;
};

type GeneratedPlan = {
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

function titleCase(input: string): string {
  return input
    .toLowerCase()
    .split(/\s|_/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function generateHashtags(niche: string, trendKeyword?: string): string[] {
  const base = ["#perte", "#virale", "#foryou", "#fyp", "#tiktokitalia"];

  const nicheMap: Record<string, string[]> = {
    fitness: ["#fitness", "#workout", "#fititalia", "#benessere"],
    beauty: ["#beauty", "#skincare", "#makeup", "#glow"],
    tech: ["#tech", "#gadget", "#ai", "#techtips"],
    travel: ["#viaggi", "#travel", "#weekend", "#scoprire"],
    food: ["#food", "#ricette", "#cucina", "#foodtok"],
    fashion: ["#moda", "#outfit", "#style", "#ootd"],
    business: ["#business", "#marketing", "#personalbrand", "#sidehustle"],
    lifestyle: ["#lifestyle", "#routine", "#productive", "#minimal"],
    educazione: ["#imparacontiktok", "#tips", "#howto", "#consigli"],
  };

  const normalized = niche.toLowerCase();
  const nicheKey = Object.keys(nicheMap).find((k) => normalized.includes(k)) ?? "lifestyle";

  const trend = trendKeyword
    ? [
        `#${trendKeyword.replace(/\s+/g, "").toLowerCase()}`,
        `#${trendKeyword.replace(/\s+/g, "").toLowerCase()}trend`,
      ]
    : [];

  const full = Array.from(new Set([...(nicheMap[nicheKey] || []), ...base, ...trend]));
  return full.slice(0, 10);
}

function pick<T>(arr: T[], biasIndex = 0): T {
  const idx = Math.min(Math.max(biasIndex, 0), arr.length - 1);
  return arr[idx];
}

function generatePlan({ niche, trendKeyword, goal, tone }: RequestBody): GeneratedPlan {
  const normalizedTone = (tone || "dinamico").toLowerCase();
  const tones: Record<string, { style: string; hookVerb: string; ctaVerb: string }> = {
    ironico: { style: "ironico e frizzante", hookVerb: "Scommetti", ctaVerb: "Dimmi" },
    motivazionale: { style: "motivazionale e energico", hookVerb: "Prova", ctaVerb: "Unisciti" },
    educativo: { style: "chiaro e didattico", hookVerb: "Sai", ctaVerb: "Scopri" },
    dinamico: { style: "rapido e dinamico", hookVerb: "Guarda", ctaVerb: "Seguimi" },
  };

  const t = tones[normalizedTone] ?? tones["dinamico"];

  const transitions = ["taglio a ritmo", "whip-pan", "snap transition", "match cut"];
  const sfx = [
    "beat veloce 140bpm",
    "pop/whip SFX + beat bounce",
    "drum & clap short loop",
    "trend audio soft + riser",
  ];

  const hookPieces = [
    `${t.hookVerb} che non conoscevi questo trucco ${niche.toLowerCase()}!`,
    `Il modo pi? veloce per un boost ${niche.toLowerCase()} in 10s`,
    `3 secondi per cambiare il tuo ${niche.toLowerCase()}`,
    `${trendKeyword ? `Trend ${trendKeyword} ma utile` : "Trucco che funziona"} (${niche})`,
  ];

  const idea = pick(hookPieces, 0);

  const visual = `Hook 0-1s: close-up con testo bold. 1-6s: dimostrazione "prima ? dopo" (${niche}). 6-9s: payoff a schermo con micro-reazione. 9-10s: CTA velocissima.`;
  const movements = [
    `${transitions[0]} sulle battute principali`,
    `Zoom-in leggero su payoff`,
    `${transitions[2]} tra prima/dopo`,
  ];
  const onScreenText = [
    `${trendKeyword ? `Trend: ${titleCase(trendKeyword)} ` : ""}in ${niche}`.trim(),
    "Prima ? Dopo (in 3 step)",
    goal ? titleCase(goal) + " immediato" : "Provalo ora",
  ];

  const audio = pick(sfx, 1);

  const hashtags = generateHashtags(niche, trendKeyword);

  const captionParts = [
    idea,
    goal ? `Obiettivo: ${goal}.` : "",
    trendKeyword ? `Usando il trend ${trendKeyword}.` : "",
  ].filter(Boolean);

  const caption = captionParts.join(" ");
  const cta = `${t.ctaVerb} per altre idee ${niche.toLowerCase()}. Condividi se ti ? utile!`;

  const publish = {
    format: "1080x1920 (9:16), 24-30fps, durata ? 10s, sottotitoli on-screen",
    title: `${titleCase(niche)} in 10s: trucco che funziona`,
    timing: "Posta tra 19:00-21:00 (Lun-Gio) o 12:00-14:00 nel weekend",
    autopublish:
      "L'auto-pubblicazione diretta richiede integrazione API TikTok Business e autorizzazione account. Esporta e pubblica manualmente dall'app per ora.",
  } as const;

  return {
    idea,
    script: { visual, movements, onScreenText, audio },
    copy: { caption, cta, hashtags },
    publish,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;
    if (!body || !body.niche || body.niche.trim().length < 2) {
      return NextResponse.json(
        { error: "Campo 'niche' obbligatorio e deve avere almeno 2 caratteri." },
        { status: 400 }
      );
    }

    const plan = generatePlan({
      niche: body.niche.trim(),
      trendKeyword: body.trendKeyword?.trim(),
      goal: body.goal?.trim(),
      tone: body.tone?.trim(),
    });

    return NextResponse.json(plan, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
  }
}
