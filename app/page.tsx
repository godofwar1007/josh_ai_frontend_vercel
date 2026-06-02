"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GraduationLogo from "../components/logo";
import {
  Mail,
  UserPlus,
  Trophy,
  GraduationCap,
  BookOpen,
  MessageSquare,
  BarChart3,
  Grid3x3,
  ArrowRight,
} from "lucide-react";

const features = [
  { label: "Rank-Based College Prediction", icon: Trophy },
  { label: "IIT / NIT / IIIT Information", icon: GraduationCap },
  { label: "JoSAA Rules Assistant", icon: BookOpen },
  { label: "AI Counselling Chat", icon: MessageSquare },
  { label: "Cutoff Analysis", icon: BarChart3 },
  { label: "Seat Matrix Insights", icon: Grid3x3 },
];

const stats = [
  { n: "23", l: "IITs" },
  { n: "31", l: "NITs" },
  { n: "26", l: "IIITs" },
  { n: "1000+", l: "Programs" },
];

const GOLD_GRADIENT = "linear-gradient(90deg, #E8A830 0%, #C8892A 50%, #D4A84B 100%)";
const GOLD_GRADIENT_LIGHT = "linear-gradient(90deg, #C8892A 0%, #B07820 100%)";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [hoveredPill, setHoveredPill] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notRegistered, setNotRegistered] = useState(false);

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError(null);
    setNotRegistered(false);

    try {
      const response = await fetch("https://josh-ai-backend.agreeablefield-8d06811c.centralindia.azurecontainerapps.io/check-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify email. Please try again.");
      }

      const data = await response.json();
      if (data.exists) {
        // User exists, save to localStorage and navigate to chat
        localStorage.setItem("josh_ai_email", email.trim().toLowerCase());
        localStorage.removeItem("josh_ai_is_guest");
        localStorage.removeItem("josh_ai_guest_id");
        router.push("/chat");
      } else {
        // User does not exist, go directly to register page
        router.push(`/register?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkipRegistration = () => {
    const guestId = `guest_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem("josh_ai_is_guest", "true");
    localStorage.setItem("josh_ai_guest_id", guestId);
    localStorage.setItem("josh_ai_name", "Guest User");
    localStorage.setItem("josh_ai_email", `guest_${guestId}@josh.ai`);
    localStorage.setItem("josh_ai_category", "OPEN");
    localStorage.setItem("josh_ai_gender", "Gender-Neutral");
    localStorage.setItem("josh_ai_adv_rank", "0");
    localStorage.setItem("josh_ai_mains_rank", "0");
    router.push("/chat");
  };

  const c = {
    pageBg: "#141210",
    eyebrow: "#D4A84B",
    headline: "#E8E3DC",
    sub: "#A8978A",
    pillBg: "#1A1816",
    pillBorder: "#3A322A",
    pillText: "#D4CCC4",
    pillIcon: "#E8A830",
    statLabel: "#8A7A6A",
    footerMute: "#8A7A6A",
    cardBg: "linear-gradient(160deg, #1A1816 0%, #141210 100%)",
    cardBorder: "#3A322A",
    cardTopBorder: "#5A4A3A",
    cardHeading: "#E8E3DC",
    divider: "#2A2420",
    inputBg: "#0F0E0C",
    inputBorder: "#3A322A",
    inputFocus: "#E8A830",
    inputText: "#E8E3DC",
    inputPlaceholder: "#5A4A3A",
    inputIcon: "#8A7A6A",
    orText: "#5A4A3A",
    secBtnBorder: "#3A322A",
    secBtnBorderHover: "#5A4A3A",
    secBtnText: "#D4CCC4",
    secBtnIcon: "#D4A84B",
    secBtnHover: "#1A1816",
    badgeBg: "#1A1816",
    badgeBorder: "#3A322A",
    badgeText: "#8A7A6A",
    radial: "radial-gradient(ellipse 800px 600px at 20% 15%, rgba(232,168,48,0.05), transparent 60%)",
    goldGrad: GOLD_GRADIENT,
    sparkGold: "#E8A830",
  };

  const goldTextStyle: React.CSSProperties = {
    background: c.goldGrad,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent",
  };

  return (
    <div className="dark">
      <div
        className="relative min-h-screen w-full font-sans"
        style={{ backgroundColor: c.pageBg }}
      >
        {/* Page-level radial */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0"
          style={{ background: c.radial }}
        />

        <main className="relative flex min-h-screen w-full flex-col lg:flex-row">
          {/* LEFT */}
          <section className="relative flex w-full flex-col px-6 py-10 sm:px-10 lg:w-[58%] lg:px-16 lg:py-14">
            {/* Logo */}
            <div className="relative flex items-center gap-3">
              <GraduationLogo size="3.2em" />
              <div className="flex flex-col">
                <h1 className="text-xl font-extrabold tracking-tight leading-tight">
                  <span style={goldTextStyle}>Josh</span>{" "}
                  <span style={{ color: c.headline }}>AI</span>
                </h1>
              </div>
            </div>

            {/* Content */}
            <div className="relative mt-14 flex flex-1 flex-col justify-center">
              <p
                className="text-[11px] font-medium uppercase"
                style={{ color: c.eyebrow, letterSpacing: "0.12em" }}
              >
                Your Personal JOSAA Counselling Assistant
              </p>

              <h2 className="mt-5 text-[34px] font-extrabold leading-[1.1] sm:text-[44px] lg:text-[52px]">
                <span style={{ color: c.headline }}>Crack Your</span>
                <br />
                <span style={goldTextStyle}>Counselling Journey</span>
                <br />
                <span style={{ color: c.headline }}>with AI</span>
              </h2>

              <p
                className="mt-6 max-w-[480px] text-[15px]"
                style={{ color: c.sub, lineHeight: 1.65 }}
              >
                Get instant college predictions, IIT information, counselling
                guidance, cutoff insights, and admission support through an
                intelligent AI assistant built specifically for JEE aspirants.
              </p>

              {/* Feature grid */}
              <div className="mt-9 grid max-w-[560px] grid-cols-1 gap-3 sm:grid-cols-2">
                {features.map((f) => {
                  const Icon = f.icon;
                  const hovered = hoveredPill === f.label;
                  return (
                    <div
                      key={f.label}
                      onMouseEnter={() => setHoveredPill(f.label)}
                      onMouseLeave={() => setHoveredPill(null)}
                      className="flex items-center gap-2.5 rounded-lg transition-colors"
                      style={{
                        backgroundColor: c.pillBg,
                        border: `1px solid ${hovered ? "#E8A830" : c.pillBorder}`,
                        padding: "10px 14px",
                      }}
                    >
                      <Icon
                        size={15}
                        style={{ color: hovered ? "#E8A830" : c.pillIcon }}
                        strokeWidth={2}
                      />
                      <span className="text-[13px] font-medium" style={{ color: c.pillText }}>
                        {f.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="mt-10 flex flex-wrap items-end gap-x-10 gap-y-4">
                {stats.map((s) => (
                  <div key={s.l}>
                    <div
                      className="text-[22px] font-bold leading-none"
                      style={goldTextStyle}
                    >
                      {s.n}
                    </div>
                    <div
                      className="mt-1.5 text-[11px] font-medium uppercase"
                      style={{ color: c.statLabel, letterSpacing: "0.08em" }}
                    >
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </section>

          {/* RIGHT */}
          <section className="flex w-full items-center justify-center px-4 py-10 sm:px-6 lg:w-[42%] lg:py-14">
            <div
              className="w-full max-w-[380px] p-6 sm:p-9"
              style={{
                background: c.cardBg,
                border: `1px solid ${c.cardBorder}`,
                borderTop: `1px solid ${c.cardTopBorder}`,
                borderRadius: "18px",
              }}
            >
              <div className="flex items-center gap-3">
                <GraduationLogo size="2.6em" />
                <span className="text-[19px] font-bold tracking-tight" style={{ color: c.cardHeading }}>
                  Welcome to Josh AI
                </span>
              </div>

              <div
                style={{ height: 1, backgroundColor: c.divider, margin: "22px 0" }}
              />

              <h3
                className="text-[21px] font-bold leading-tight"
                style={{ color: c.cardHeading }}
              >
                Start your counselling journey.
              </h3>
              <p className="mt-2 text-[14px]" style={{ color: c.sub, marginBottom: 22 }}>
                Enter your email to get personalized guidance.
              </p>

              {/* Email input */}
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: c.inputIcon }}
                  strokeWidth={2}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSignIn();
                    }
                  }}
                  placeholder="you@example.com"
                  className="w-full text-[14px] outline-none transition-colors"
                  style={{
                    backgroundColor: c.inputBg,
                    border: `1px solid ${c.inputBorder}`,
                    borderRadius: 8,
                    padding: "12px 14px 12px 42px",
                    color: c.inputText,
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = c.inputFocus)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
                />
                <style>{`input::placeholder { color: ${c.inputPlaceholder}; }`}</style>
              </div>

              {/* Error and Not Registered Messages */}
              {error && (
                <p className="mt-2 text-[13px] text-red-500 font-medium text-left">
                  {error}
                </p>
              )}

              {notRegistered && (
                <div 
                  className="mt-3 rounded-lg border p-3.5 text-left transition-colors"
                  style={{
                    borderColor: `${c.sparkGold}44`,
                    backgroundColor: `${c.sparkGold}11`,
                  }}
                >
                  <p className="text-[13px] font-bold" style={{ color: c.sparkGold }}>
                    Account not found
                  </p>
                  <p className="mt-1 text-[12px]" style={{ color: c.sub }}>
                    We couldn&apos;t find an account with this email. Would you like to create a new one?
                  </p>
                  <Link
                    href={`/register?email=${encodeURIComponent(email)}`}
                    className="mt-2.5 inline-flex items-center gap-1 text-[13px] font-bold transition-all hover:underline"
                    style={{ color: c.sparkGold }}
                  >
                    Create Account <ArrowRight size={13} strokeWidth={2.5} />
                  </Link>
                </div>
              )}

              {/* CTA */}
              <button
                onClick={() => handleSignIn()}
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-1.5 text-[15px] transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, #E8A830 0%, #C8892A 50%, #B87820 100%)",
                  borderRadius: 10,
                  padding: "13px",
                  color: "#1A1210",
                  fontWeight: 700,
                  boxShadow: "0 2px 12px rgba(200, 137, 42, 0.25)",
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #F0B535 0%, #D4962E 50%, #C28528 100%)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #E8A830 0%, #C8892A 50%, #B87820 100%)";
                  }
                }}
              >
                {loading ? "Verifying..." : "Sign In"} <ArrowRight size={16} strokeWidth={2.5} />
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3" style={{ margin: "22px 0" }}>
                <div style={{ flex: 1, height: 1, backgroundColor: c.divider }} />
                <span className="text-[12px]" style={{ color: c.orText }}>
                  or
                </span>
                <div style={{ flex: 1, height: 1, backgroundColor: c.divider }} />
              </div>

              {/* Secondary */}
              <Link
                href="/register"
                className="flex w-full items-center justify-center gap-2 text-[14px] font-medium transition-colors"
                style={{
                  backgroundColor: "transparent",
                  border: `1px solid ${c.secBtnBorder}`,
                  borderRadius: 8,
                  padding: "11px",
                  color: c.secBtnText,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = c.secBtnHover;
                  e.currentTarget.style.borderColor = c.secBtnBorderHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = c.secBtnBorder;
                }}
              >
                <UserPlus size={15} style={{ color: c.secBtnIcon }} strokeWidth={2} />
                New to Josh AI? Create Account
              </Link>

              {/* Skip Registration */}
              <button
                onClick={handleSkipRegistration}
                className="mt-3 flex w-full items-center justify-center gap-2 text-[14px] font-medium transition-colors"
                style={{
                  backgroundColor: "transparent",
                  border: `1px solid ${c.secBtnBorder}`,
                  borderRadius: 8,
                  padding: "11px",
                  color: c.secBtnText,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = c.secBtnHover;
                  e.currentTarget.style.borderColor = c.secBtnBorderHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = c.secBtnBorder;
                }}
              >
                <ArrowRight size={15} style={{ color: c.secBtnIcon }} strokeWidth={2} />
                Skip Registration
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
