import "./globals.css";
import type { CSSProperties } from "react";

export const metadata = {
  title: "Tabungan Impian",
  description: "Pantau target tabungan dan dapat pengingat lewat Telegram",
  manifest: "/manifest.json",
};

const blob = (s: Record<string, string>): CSSProperties => s as CSSProperties;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen antialiased">
        <div className="scrollbar" aria-hidden />
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="blob" style={blob({ top: "-14%", left: "-12%", "--c": "#10b981" })} />
          <div className="blob" style={blob({ top: "8%", right: "-16%", "--c": "#8b5cf6", animationDelay: "-7s" })} />
          <div className="blob" style={blob({ bottom: "-18%", left: "22%", "--c": "#f43f5e", animationDelay: "-13s" })} />
        </div>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}.bar{transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
