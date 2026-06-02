"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import GraduationLogo from "../../components/logo";
import {
  Trophy,
  User,
} from "lucide-react";

const GOLD_GRADIENT = "linear-gradient(90deg, #E8A830 0%, #C8892A 50%, #D4A84B 100%)";

function WelcomeContent() {
  const searchParams = useSearchParams();

  const [userData, setUserData] = useState({
    email: "",
    name: "Student",
    category: "General",
    gender: "Male",
    advancedRank: "5000",
    mainRank: "",
  });

  useEffect(() => {
    const email = searchParams.get("email") || "";
    const name = searchParams.get("name") || "Student";
    const category = searchParams.get("category") || "General";
    const gender = searchParams.get("gender") || "Male";
    const advancedRank = searchParams.get("advancedRank") || "5000";
    const mainRank = searchParams.get("mainRank") || "";

    setUserData({
      email,
      name,
      category,
      gender,
      advancedRank,
      mainRank,
    });

    if (email) {
      localStorage.setItem("josh_ai_email", email.toLowerCase());
    }
    if (name) localStorage.setItem("josh_ai_name", name);
    if (category) localStorage.setItem("josh_ai_category", category);
    if (gender) localStorage.setItem("josh_ai_gender", gender);
    if (advancedRank) localStorage.setItem("josh_ai_adv_rank", advancedRank);
    if (mainRank) localStorage.setItem("josh_ai_mains_rank", mainRank);
    localStorage.removeItem("josh_ai_is_guest");
    localStorage.removeItem("josh_ai_guest_id");
  }, [searchParams]);

  const c = {
    pageBg: "#141210",
    headline: "#E8E3DC",
    sub: "#8A7050",
    cardBg: "#272420",
    cardBorder: "#3A3530",
    divider: "#332A1C",
    pillBg: "#2A2318",
    pillBorder: "#332A1C",
    pillText: "#C4B898",
    pillIcon: "#8A7050",
    labelText: "#8A7050",
    valueText: "#C8892A",
    helperText: "#5A4A32",
    badgeBg: "#1A1816",
    badgeBorder: "#3A322A",
    badgeText: "#8A7A6A",
    secBtnBg: "transparent",
    secBtnBorder: "#3A3530",
    secBtnText: "#C4B898",
    noteText: "#5A4A32",
    radial: "radial-gradient(ellipse 800px 600px at 50% 30%, rgba(232,168,48,0.05), transparent 60%)",
    goldGrad: GOLD_GRADIENT,
    sparkGold: "#E8A830",
    amberGrad: "linear-gradient(90deg, #E8A830 0%, #C8892A 100%)",
  };

  const goldTextStyle: React.CSSProperties = {
    background: c.goldGrad,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent",
  };

  const amberGradientText: React.CSSProperties = {
    background: c.amberGrad,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent",
  };

  return (
    <div className="dark">
      <div
        className="relative flex min-h-screen w-full flex-col font-sans"
        style={{ backgroundColor: c.pageBg }}
      >
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0"
          style={{ background: c.radial }}
        />

        {/* Top bar */}
        <header className="relative flex items-center justify-between px-6 py-5 sm:px-10">
          <div className="flex items-center gap-3">
            <GraduationLogo size="3.2em" />
            <div className="flex flex-col">
              <h1 className="text-xl font-extrabold tracking-tight leading-tight">
                <span style={goldTextStyle}>Josh</span>{" "}
                <span style={{ color: c.headline }}>AI</span>
              </h1>
            </div>
          </div>

        </header>

        {/* Centered card */}
        <main className="relative flex flex-1 items-center justify-center px-4 py-10">
          <div
            className="w-full max-w-[560px] text-center"
            style={{
              background: c.cardBg,
              border: `1px solid ${c.cardBorder}`,
              borderRadius: "20px",
              padding: "48px",
            }}
          >
            {/* Trophy */}
            <Trophy
              size={52}
              style={{ color: c.sparkGold, margin: "0 auto" }}
              strokeWidth={1.5}
            />

            {/* Eyebrow */}
            <p
              className="mt-5 text-[11px] font-medium uppercase"
              style={{ color: c.labelText, letterSpacing: "0.12em" }}
            >
              JEE ADVANCED 2025
            </p>

            {/* Main heading */}
            <div className="mt-3" style={{ lineHeight: 1.1 }}>
              <p className="text-[22px] font-bold" style={{ color: c.headline }}>
                Congratulations on obtaining
              </p>
              <p
                className="mt-1 text-[38px] font-extrabold"
                style={amberGradientText}
              >
                Rank {userData.advancedRank}
              </p>
              <p className="mt-1 text-[22px] font-bold" style={{ color: c.headline }}>
                in JEE Advanced!
              </p>
            </div>

            {/* Name pill */}
            <div
              className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1"
              style={{
                backgroundColor: c.pillBg,
                border: `1px solid ${c.pillBorder}`,
              }}
            >
              <User size={14} style={{ color: c.pillIcon }} strokeWidth={2} />
              <span className="text-[13px]" style={{ color: c.pillText }}>
                {userData.name}
              </span>
            </div>

            {/* Rank details box */}
            <div
              className="mx-auto mt-5 max-w-[400px]"
              style={{
                backgroundColor: c.pillBg,
                border: `1px solid ${c.pillBorder}`,
                borderRadius: "12px",
                padding: "18px 24px",
              }}
            >
              <div
                className={`flex ${userData.mainRank ? "justify-between" : "justify-center"}`}
              >
                {/* JEE Advanced */}
                <div className={userData.mainRank ? "text-left" : "text-center"}>
                  <p
                    className="text-[10px] font-medium uppercase"
                    style={{ color: c.labelText, letterSpacing: "0.1em" }}
                  >
                    JEE ADVANCED
                  </p>
                  <p
                    className="mt-1 text-[20px] font-bold"
                    style={{ color: c.valueText }}
                  >
                    {userData.advancedRank}
                  </p>
                  <p className="text-[11px]" style={{ color: c.helperText }}>
                    CRL Rank
                  </p>
                </div>

                {/* Divider + JEE Main */}
                {userData.mainRank && (
                  <>
                    <div
                      style={{
                        width: 1,
                        backgroundColor: c.divider,
                        margin: "0 20px",
                      }}
                    />
                    <div className="text-right">
                      <p
                        className="text-[10px] font-medium uppercase"
                        style={{ color: c.labelText, letterSpacing: "0.1em" }}
                      >
                        JEE MAIN
                      </p>
                      <p
                        className="mt-1 text-[20px] font-bold"
                        style={{ color: c.valueText }}
                      >
                        {userData.mainRank}
                      </p>
                      <p className="text-[11px]" style={{ color: c.helperText }}>
                        NTA Score / Rank
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Category + Gender */}
              <div
                className="mt-4 pt-3 text-center"
                style={{ borderTop: `1px solid ${c.divider}` }}
              >
                <p className="text-[12px]" style={{ color: c.helperText }}>
                  {userData.category} • {userData.gender || "Not specified"}
                </p>
              </div>
            </div>

            {/* Motivational text */}
            <p
              className="mx-auto mt-5 max-w-[400px] text-[14px]"
              style={{ color: c.sub, lineHeight: 1.65 }}
            >
              Your rank opens doors to some of India&apos;s finest institutions.
              Josh AI will help you navigate every step of JOSAA counselling.
            </p>

            {/* Button */}
            <div className="mt-6">
              <Link
                href="/chat"
                onClick={() => {
                  if (userData.email) {
                    localStorage.setItem("josh_ai_email", userData.email.toLowerCase());
                    localStorage.setItem("josh_ai_name", userData.name);
                    localStorage.setItem("josh_ai_category", userData.category);
                    localStorage.setItem("josh_ai_gender", userData.gender);
                    localStorage.setItem("josh_ai_adv_rank", userData.advancedRank);
                    localStorage.setItem("josh_ai_mains_rank", userData.mainRank || "0");
                  }
                }}
                className="flex w-full items-center justify-center text-[15px] transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, #E8A830 0%, #C8892A 50%, #B87820 100%)",
                  borderRadius: 8,
                  padding: "13px",
                  color: "#1A1210",
                  fontWeight: 700,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(135deg, #F0B535 0%, #D4962E 50%, #C28528 100%)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(135deg, #E8A830 0%, #C8892A 50%, #B87820 100%)")
                }
              >
                {"Start Counselling with Josh AI →"}
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#141210]" />}>
      <WelcomeContent />
    </Suspense>
  );
}
