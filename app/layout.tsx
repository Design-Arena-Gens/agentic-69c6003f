import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agente TikTok Virale",
  description: "Genera idee, script e copy per video virali su TikTok (<=10s)",
  metadataBase: new URL("https://agentic-69c6003f.vercel.app"),
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <div className="min-h-dvh">
          <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">{children}</main>
          <footer className="text-center text-slate-400 pb-8">
            <p>
              Costruito con Next.js ? Pronto per Vercel
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
