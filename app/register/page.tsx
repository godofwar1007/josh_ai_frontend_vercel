"use client";

import { useState, useEffect } from "react";
import GraduationLogo from "../../components/logo";
import {
  User,
  Mail,
  Hash,
  ChevronDown,
} from "lucide-react";

const categories = [
  "OPEN",
  "OPEN(PwD)",
  "OBC-NCL",
  "OBC-NCL(PwD)",
  "SC",
  "SC(PwD)",
  "ST",
  "ST(PwD)",
  "GEN-EWS",
  "GEN-EWS(PwD)",
];

const GOLD_GRADIENT = "linear-gradient(90deg, #E8A830 0%, #C8892A 50%, #D4A84B 100%)";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [jeeAdvancedRank, setJeeAdvancedRank] = useState("");
  const [jeeMainRank, setJeeMainRank] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get("email");
      if (emailParam) {
        setEmail(emailParam);
      }
    }
  }, []);

  const c = {
    pageBg: "#141210",
    eyebrow: "#D4A84B",
    headline: "#E8E3DC",
    cardBg: "#272420",
    cardBorder: "#3A3530",
    cardHeading: "#E8E3DC",
    divider: "#333029",
    inputBg: "#1E1C18",
    inputBorder: "#3D3A35",
    inputFocus: "#C8892A",
    inputText: "#E8E3DC",
    inputPlaceholder: "#5A4A32",
    inputIcon: "#8A7050",
    labelText: "#8A7050",
    helperText: "#5A4A32",
    mutedText: "#8A7050",
    optionalBg: "#2A2318",
    optionalBorder: "#332A1C",
    optionalText: "#5A4A32",
    dropdownBg: "#2A2318",
    dropdownHover: "#332A1C",
    unselectedBg: "#1E1C18",
    unselectedBorder: "#3D3A35",
    unselectedText: "#8A7050",
    selectedBg: "#2A2318",
    selectedBorder: "#C8892A",
    selectedText: "#C8892A",
    radial: "radial-gradient(ellipse 800px 600px at 50% 20%, rgba(232,168,48,0.05), transparent 60%)",
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

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim() || !category || !gender || !jeeAdvancedRank.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // Check if user already exists
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

      // Save registration parameters to localStorage
      localStorage.setItem("josh_ai_email", email.trim().toLowerCase());
      localStorage.setItem("josh_ai_name", fullName.trim());
      localStorage.setItem("josh_ai_category", category);
      localStorage.setItem("josh_ai_gender", gender);
      localStorage.setItem("josh_ai_adv_rank", jeeAdvancedRank.trim());
      localStorage.setItem("josh_ai_mains_rank", jeeMainRank.trim() || "0");
      localStorage.removeItem("josh_ai_is_guest");
      localStorage.removeItem("josh_ai_guest_id");

      if (data.exists) {
        // Already exists, go directly to chat page
        window.location.href = "/chat";
      } else {
        // New user, go to welcome page
        const params = new URLSearchParams({
          email: email.trim().toLowerCase(),
          name: fullName.trim(),
          category: category,
          gender: gender,
          advancedRank: jeeAdvancedRank.trim(),
          mainRank: jeeMainRank.trim(),
        });
        window.location.href = `/welcome?${params.toString()}`;
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark">
      <div
        className="relative min-h-screen w-full font-sans"
        style={{ backgroundColor: c.pageBg }}
      >
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0"
          style={{ background: c.radial }}
        />

        <main className="relative flex min-h-screen w-full items-center justify-center px-4 py-10 sm:px-6">
          <div
            className="w-full max-w-[480px]"
            style={{
              background: c.cardBg,
              border: `1px solid ${c.cardBorder}`,
              borderRadius: "16px",
              padding: "36px",
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <GraduationLogo size="3.2em" />
              <div className="flex flex-col">
                <h1 className="text-xl font-extrabold tracking-tight leading-tight">
                  <span style={goldTextStyle}>Josh</span>{" "}
                  <span style={{ color: c.headline }}>AI</span>
                </h1>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <GraduationLogo size="2.8em" className="mt-0.5" />
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold" style={{ color: c.cardHeading }}>
                  Create Your Account
                </span>
                <span className="text-[12px]" style={{ color: c.mutedText }}>
                  Join thousands of JEE aspirants
                </span>
              </div>
            </div>

            <div
              style={{ height: 1, backgroundColor: c.divider, margin: "22px 0" }}
            />

            <h3
              className="text-[21px] font-bold leading-tight"
              style={{ color: c.cardHeading }}
            >
              {"Let's get you started."}
            </h3>
            <p className="mt-2 text-[14px]" style={{ color: c.mutedText, marginBottom: 22 }}>
              Fill in your details to personalize your counselling experience.
            </p>

            {/* Full Name */}
            <div className="mb-4">
              <label className="mb-1.5 block text-[13px]" style={{ color: c.labelText }}>
                Full Name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: c.inputIcon }}
                  strokeWidth={2}
                />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
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
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="mb-1.5 block text-[13px]" style={{ color: c.labelText }}>
                Email Address
              </label>
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
              </div>
            </div>

            {/* Category */}
            <div className="relative mb-4">
              <label className="mb-1.5 block text-[13px]" style={{ color: c.labelText }}>
                Category
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex w-full items-center justify-between text-[14px] outline-none transition-colors"
                  style={{
                    backgroundColor: c.inputBg,
                    border: `1px solid ${dropdownOpen ? c.inputFocus : c.inputBorder}`,
                    borderRadius: 8,
                    padding: "12px 14px",
                    color: category ? c.inputText : c.inputPlaceholder,
                  }}
                >
                  {category || "Select your category"}
                  <ChevronDown
                    size={16}
                    style={{ color: c.inputIcon }}
                    strokeWidth={2}
                  />
                </button>
                {dropdownOpen && (
                  <div
                    className="absolute left-0 right-0 top-full z-10 mt-1 max-h-[200px] overflow-y-auto"
                    style={{
                      backgroundColor: c.dropdownBg,
                      border: `1px solid ${c.inputBorder}`,
                      borderRadius: 8,
                    }}
                  >
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategory(cat);
                          setDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-[14px] transition-colors"
                        style={{ color: c.inputText }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = c.dropdownHover)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Gender */}
            <div className="mb-4">
              <label className="mb-1.5 block text-[13px]" style={{ color: c.labelText }}>
                Gender
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className="flex-1 rounded-lg py-2.5 text-[14px] font-medium transition-colors"
                  style={{
                    backgroundColor: gender === "male" ? c.selectedBg : c.unselectedBg,
                    border: `1px solid ${gender === "male" ? c.selectedBorder : c.unselectedBorder}`,
                    color: gender === "male" ? c.selectedText : c.unselectedText,
                  }}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className="flex-1 rounded-lg py-2.5 text-[14px] font-medium transition-colors"
                  style={{
                    backgroundColor: gender === "female" ? c.selectedBg : c.unselectedBg,
                    border: `1px solid ${gender === "female" ? c.selectedBorder : c.unselectedBorder}`,
                    color: gender === "female" ? c.selectedText : c.unselectedText,
                  }}
                >
                  Female
                </button>
              </div>
            </div>

            {/* JEE Advanced Rank */}
            <div className="mb-4">
              <label className="mb-1.5 block text-[13px]" style={{ color: c.labelText }}>
                JEE Advanced Category Rank
              </label>
              <div className="relative">
                <Hash
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: c.inputIcon }}
                  strokeWidth={2}
                />
                <input
                  type="text"
                  value={jeeAdvancedRank}
                  onChange={(e) => setJeeAdvancedRank(e.target.value)}
                  placeholder="Enter your category rank"
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
              </div>
            </div>

            {/* JEE Main Rank */}
            <div className="mb-5">
              <div className="mb-1.5 flex items-center gap-2">
                <label className="text-[13px]" style={{ color: c.labelText }}>
                  JEE Main Category Rank
                </label>
                <span
                  className="rounded-full px-1.5 py-0.5 text-[10px]"
                  style={{
                    backgroundColor: c.optionalBg,
                    border: `1px solid ${c.optionalBorder}`,
                    color: c.optionalText,
                  }}
                >
                  Optional
                </span>
              </div>
              <div className="relative">
                <Hash
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: c.inputIcon }}
                  strokeWidth={2}
                />
                <input
                  type="text"
                  value={jeeMainRank}
                  onChange={(e) => setJeeMainRank(e.target.value)}
                  placeholder="Enter your category rank"
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
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="mt-3 text-[13px] text-red-500 font-medium text-left">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-1.5 text-[15px] transition-all"
              style={{
                background:
                  "linear-gradient(135deg, #E8A830 0%, #C8892A 50%, #B87820 100%)",
                borderRadius: 8,
                padding: "13px",
                color: "#1A1210",
                fontWeight: 700,
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
              {loading ? "Checking details..." : "Create Account →"}
            </button>

            <style>{`input::placeholder { color: ${c.inputPlaceholder}; }`}</style>
          </div>
        </main>
      </div>
    </div>
  );
}
