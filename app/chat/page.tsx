"use client";
import { useState, useRef, useEffect } from "react";
import GraduationLogo from "../../components/logo";
import {
  Moon,
  Sun,
  Settings,
  ArrowUp,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Map,
  Loader2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const GOLD_GRADIENT = "linear-gradient(90deg, #E8A830 0%, #C8892A 50%, #D4A84B 100%)";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
}

interface ToolCall {
  id: string;
  name: string;
  status: "running" | "complete";
  output?: string;
}

const suggestions = [
  {
    icon: GraduationCap,
    title: "College Predictions",
    query: "What colleges can I get with rank 5000 OBC?",
  },
  {
    icon: BookOpen,
    title: "JOSAA Rules",
    query: "Explain the difference between round 1 and round 2",
  },
  {
    icon: TrendingUp,
    title: "Cutoff Trends",
    query: "IIT Bombay CSE cutoff trends last 5 years",
  },
  {
    icon: Map,
    title: "Branch Guidance",
    query: "Best branches to choose for rank between 8000-10000",
  },
];

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("OPEN");
  const [gender, setGender] = useState("male");
  const [advRank, setAdvRank] = useState(0);
  const [mainsRank, setMainsRank] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [guestId, setGuestId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("josh_ai_email");
      if (!storedEmail) {
        window.location.href = "/";
        return;
      }
      setEmail(storedEmail);
      setName(localStorage.getItem("josh_ai_name") || "");
      setCategory(localStorage.getItem("josh_ai_category") || "OPEN");
      setGender(localStorage.getItem("josh_ai_gender") || "male");
      setAdvRank(parseInt(localStorage.getItem("josh_ai_adv_rank") || "0", 10));
      setMainsRank(parseInt(localStorage.getItem("josh_ai_mains_rank") || "0", 10));
      setIsGuest(localStorage.getItem("josh_ai_is_guest") === "true");
      setGuestId(localStorage.getItem("josh_ai_guest_id") || "");
      setIsMounted(true);
    }
  }, []);

  const getInitials = () => {
    if (!name) return "US";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const dynamicSuggestions = [
    {
      icon: GraduationCap,
      title: "College Predictions",
      query: advRank > 0 
        ? `What IITs can I get with my JEE Advanced rank of ${advRank} in ${category} category?`
        : "What IITs can I get with my JEE Advanced rank?",
    },
    {
      icon: BookOpen,
      title: "JOSAA Rules",
      query: "Explain the difference between round 1 and round 2 seat acceptance rules",
    },
    {
      icon: TrendingUp,
      title: "Cutoff Trends",
      query: "IIT Bombay Computer Science cutoff trends for last 5 years",
    },
    {
      icon: Map,
      title: "Branch Guidance",
      query: mainsRank > 0
        ? `Best NIT branches for my JEE Main rank of ${mainsRank} in ${category} category`
        : "Best engineering branches to choose based on placements",
    },
  ];

  const c = {
    pageBg: "#141210",
    navBg: "#1A1714",
    navBorder: "#2A2218",
    headline: "#E8E3DC",
    sub: "#8A7050",
    cardBg: "#1E1C18",
    cardBorder: "#332A1C",
    cardHoverBorder: "#C8892A",
    cardHoverBg: "#2A2318",
    inputBg: "#1E1C18",
    inputBorder: "#3D3A35",
    inputFocus: "#C8892A",
    inputText: "#E8E3DC",
    inputPlaceholder: "#3D3025",
    userMsgBg: "#2A2318",
    userMsgBorder: "#332A1C",
    userMsgText: "#E8E3DC",
    assistantText: "#D4CFC8",
    timestampText: "#5A4A32",
    toolBg: "#1A1714",
    toolBorder: "#2A2218",
    toolExpandedBg: "#141210",
    toolText: "#8A7050",
    toolCompleteText: "#5A4A32",
    codeBg: "#1E1C18",
    codeBorder: "#332A1C",
    avatarBg: "#2A2318",
    avatarBorder: "#332A1C",
    avatarText: "#C8892A",
    badgeBg: "#1A1816",
    badgeBorder: "#3A322A",
    badgeText: "#8A7A6A",
    sendBtnActive: "linear-gradient(135deg, #E8A830 0%, #C8892A 100%)",
    sendBtnInactive: "#2A2318",
    sendBtnInactiveBorder: "#332A1C",
    sendIconActive: "#1A1210",
    sendIconInactive: "#5A4A32",
    noteText: "#3D3025",
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 6 * 24;
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || !email || isLoading) return;

    const userQuery = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userQuery,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();
    
    // Add placeholder assistant message
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        toolCalls: [],
      },
    ]);

    try {
      // Map category to clean values for the backend
      const cleanCategory = category.includes("OBC") ? "OBC-NCL" :
                            category.includes("EWS") ? "GEN-EWS" :
                            category.includes("SC") ? "SC" :
                            category.includes("ST") ? "ST" : "OPEN";

      // Map gender to expected clean values
      const cleanGender = gender === "female" ? "Female" : "Male";

      const response = await fetch("https://josh-ai-backend.agreeablefield-8d06811c.centralindia.azurecontainerapps.io/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userQuery,
          email: email,
          skip_registration: isGuest,
          session_id: isGuest ? guestId : "default_session",
          name: name,
          adv_rank: advRank,
          mains_rank: mainsRank,
          category: cleanCategory,
          gender: cleanGender,
        }),
      });

      if (!response.ok) {
        throw new Error("Server responded with an error. Please try again.");
      }

      if (!response.body) {
        throw new Error("No readable response body from server.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = "";
      
      const getToolLabel = (toolName: string, status: "running" | "complete") => {
        if (status === "running") {
          switch (toolName) {
            case "retrieve_college_allocations_JEE_Adv":
              return "Searching for opening and closing ranks of IITs...";
            case "retrieve_college_allocations_JEE_Main":
              return "Searching for opening and closing ranks of NITs/IIITs...";
            case "placement_data":
              return "Fetching college placement statistics...";
            case "search_jossa":
              return "Checking official JoSAA rules...";
            case "search_google_images":
              return "Searching for college images...";
            case "search_web_serper":
              return "Searching the web for latest updates...";
            default:
              return `Running ${toolName}...`;
          }
        } else {
          switch (toolName) {
            case "retrieve_college_allocations_JEE_Adv":
              return "Searched for opening and closing ranks of IITs";
            case "retrieve_college_allocations_JEE_Main":
              return "Searched for opening and closing ranks of NITs/IIITs";
            case "placement_data":
              return "Fetched college placement statistics";
            case "search_jossa":
              return "Checked official JoSAA rules";
            case "search_google_images":
              return "Searched for college images";
            case "search_web_serper":
              return "Searched the web for latest updates";
            default:
              return `Completed ${toolName}`;
          }
        }
      };

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value || new Uint8Array(), { stream: !done });
        accumulatedText += chunk;

        // Parse tool calls in accumulatedText
        const toolPattern = /\|\|TOOL_CALL:([a-zA-Z0-9_]+)\|\|/g;
        let match;
        const foundTools: string[] = [];
        
        let cleanText = accumulatedText;
        while ((match = toolPattern.exec(accumulatedText)) !== null) {
          foundTools.push(match[1]);
          cleanText = cleanText.replace(match[0], "");
        }

        // We update the assistant message on the fly
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === assistantMessageId) {
              const currentToolCalls = foundTools.map((toolName, index) => {
                const isRunning = cleanText.trim().length === 0 && !done;
                const status = isRunning ? ("running" as const) : ("complete" as const);
                const label = getToolLabel(toolName, status);
                return {
                  id: `tool-${toolName}-${index}`,
                  name: label,
                  status: status,
                  output: isRunning ? undefined : "Query executed successfully",
                };
              });

              return {
                ...msg,
                content: cleanText,
                toolCalls: currentToolCalls,
              };
            }
            return msg;
          })
        );
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: `⚠️ Error: ${err.message || "Unable to connect to the backend server. Please make sure the backend is active."}`,
              }
            : msg
        )
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        handleSend();
      }
    }
  };

  const handleSuggestionClick = (query: string) => {
    setInput(query);
  };

  const toggleToolExpanded = (toolId: string) => {
    setExpandedTools((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(toolId)) {
        newSet.delete(toolId);
      } else {
        newSet.add(toolId);
      }
      return newSet;
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderMessageContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    
    let inList: "none" | "bullet" | "ordered" = "none";
    let listItems: string[] = [];
    
    let inTable = false;
    let tableRows: string[][] = [];
    
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let codeLanguage = "";

    const flushList = (key: string) => {
      if (inList === "none" || listItems.length === 0) return;
      if (inList === "bullet") {
        elements.push(
          <ul key={`ul-${key}`} className="my-2 list-disc list-inside space-y-1 pl-4" style={{ color: c.assistantText }}>
            {listItems.map((item, idx) => (
              <li key={idx} className="text-[14px]">
                {renderInlineText(item)}
              </li>
            ))}
          </ul>
        );
      } else if (inList === "ordered") {
        elements.push(
          <ol key={`ol-${key}`} className="my-2 list-decimal list-inside space-y-1 pl-4" style={{ color: c.assistantText }}>
            {listItems.map((item, idx) => (
              <li key={idx} className="text-[14px]">
                {renderInlineText(item)}
              </li>
            ))}
          </ol>
        );
      }
      listItems = [];
      inList = "none";
    };

    const flushTable = (key: string) => {
      if (!inTable || tableRows.length === 0) return;
      const headers = tableRows[0];
      const dataRows = tableRows.slice(1);
      elements.push(
        <div key={`table-${key}`} className="my-4 overflow-x-auto w-full max-w-full rounded-xl border" style={{ borderColor: c.toolBorder }}>
          <table className="min-w-full divide-y table-auto" style={{ divideColor: c.toolBorder, backgroundColor: c.toolBg }}>
            <thead>
              <tr style={{ backgroundColor: c.userMsgBg }}>
                {headers.map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: c.avatarText }}>
                    {renderInlineText(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ divideColor: c.toolBorder }}>
              {dataRows.map((row, rowIdx) => (
                <tr key={rowIdx} className="transition-colors hover:bg-neutral-800/10">
                  {row.map((val, cellIdx) => (
                    <td key={cellIdx} className="whitespace-normal px-4 py-2.5 text-[13px]" style={{ color: c.assistantText }}>
                      {renderInlineText(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    };

    const flushCodeBlock = (key: string) => {
      if (!inCodeBlock) return;
      elements.push(
        <pre
          key={`code-${key}`}
          className="my-3 overflow-x-auto rounded-lg border p-4 font-mono text-[13px]"
          style={{
            backgroundColor: c.codeBg,
            borderColor: c.codeBorder,
            color: c.headline,
          }}
        >
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      codeLines = [];
      inCodeBlock = false;
    };

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      const trimmedLine = line.trim();

      // Handle Code Block
      if (trimmedLine.startsWith("```")) {
        if (inCodeBlock) {
          flushCodeBlock(`${idx}`);
        } else {
          flushList(`${idx}`);
          flushTable(`${idx}`);
          inCodeBlock = true;
          codeLanguage = trimmedLine.slice(3).trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      // Handle Table
      if (trimmedLine.startsWith("|") && trimmedLine.endsWith("|")) {
        flushList(`${idx}`);
        if (trimmedLine.includes("---") || trimmedLine.includes("===")) {
          // Skip separator
          continue;
        }
        inTable = true;
        const cols = trimmedLine
          .split("|")
          .map((col) => col.trim())
          .filter((_, i, arr) => i > 0 && i < arr.length - 1);
        tableRows.push(cols);
        continue;
      } else {
        if (inTable) {
          flushTable(`${idx}`);
        }
      }

      // Handle HTML Lists (<ul>, <ol>, <li>)
      const hasUl = /<ul\b/i.test(trimmedLine);
      const hasOl = /<ol\b/i.test(trimmedLine);
      const hasCloseUl = /<\/ul>/i.test(trimmedLine);
      const hasCloseOl = /<\/ol>/i.test(trimmedLine);
      const liMatches = [...trimmedLine.matchAll(/<li\b[^>]*>(.*?)<\/li>/gi)];

      if (hasUl || hasOl || liMatches.length > 0 || hasCloseUl || hasCloseOl) {
        if (hasUl) {
          flushList(`${idx}`);
          flushTable(`${idx}`);
          inList = "bullet";
        } else if (hasOl) {
          flushList(`${idx}`);
          flushTable(`${idx}`);
          inList = "ordered";
        }

        if (liMatches.length > 0) {
          if (inList === "none") {
            inList = "bullet";
          }
          liMatches.forEach((m) => {
            listItems.push(m[1]);
          });
        } else {
          const openLiMatch = trimmedLine.match(/<li\b[^>]*>(.*)/i);
          if (openLiMatch) {
            if (inList === "none") {
              inList = "bullet";
            }
            listItems.push(openLiMatch[1].replace(/<\/li>/i, ""));
          }
        }

        if (hasCloseUl || hasCloseOl) {
          flushList(`${idx}-close`);
        }
        continue;
      }

      // Handle Lists
      const bulletMatch = line.match(/^(\s*)[-*•]\s+(.*)/);
      if (bulletMatch) {
        if (inList === "ordered") {
          flushList(`${idx}`);
        }
        inList = "bullet";
        listItems.push(bulletMatch[2]);
        continue;
      }

      const orderedMatch = line.match(/^(\s*)\d+\.\s+(.*)/);
      if (orderedMatch) {
        if (inList === "bullet") {
          flushList(`${idx}`);
        }
        inList = "ordered";
        listItems.push(orderedMatch[2]);
        continue;
      }

      // Flush lists if any before block element
      flushList(`${idx}`);

      // Handle Headers & blockquotes
      if (trimmedLine.startsWith("#### ")) {
        elements.push(
          <h4 key={idx} className="mt-4 mb-2 text-sm font-semibold tracking-tight" style={{ color: c.headline }}>
            {renderInlineText(trimmedLine.slice(5))}
          </h4>
        );
      } else if (trimmedLine.startsWith("### ")) {
        elements.push(
          <h3 key={idx} className="mt-4 mb-2 text-base font-semibold tracking-tight" style={{ color: c.headline }}>
            {renderInlineText(trimmedLine.slice(4))}
          </h3>
        );
      } else if (trimmedLine.startsWith("## ")) {
        elements.push(
          <h2 key={idx} className="mt-5 mb-2.5 text-lg font-semibold tracking-tight" style={{ color: c.headline }}>
            {renderInlineText(trimmedLine.slice(3))}
          </h2>
        );
      } else if (trimmedLine.startsWith("# ")) {
        elements.push(
          <h1 key={idx} className="mt-6 mb-3 text-xl font-bold tracking-tight" style={{ color: c.headline }}>
            {renderInlineText(trimmedLine.slice(2))}
          </h1>
        );
      } else if (trimmedLine.startsWith("> ")) {
        elements.push(
          <blockquote
            key={idx}
            className="my-3 border-l-4 pl-4 italic text-[14px]"
            style={{ borderColor: c.toolBorder, color: c.toolText }}
          >
            {renderInlineText(trimmedLine.slice(2))}
          </blockquote>
        );
      } else if (trimmedLine) {
        elements.push(
          <p key={idx} className="my-2.5 text-[14px]" style={{ lineHeight: 1.6 }}>
            {renderInlineText(line)}
          </p>
        );
      } else {
        elements.push(<div key={idx} className="h-2" />);
      }
    }

    flushList("final");
    flushTable("final");
    flushCodeBlock("final");

    return elements;
  };

  const renderInlineText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s()<>]+|<br\s*\/?>)/gi);
    return parts.map((part, i) => {
      if (part.toLowerCase().match(/^<br\s*\/?>$/)) {
        return <br key={i} />;
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} style={{ color: c.headline, fontWeight: 600 }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={i} style={{ color: c.headline }}>
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="rounded px-1.5 py-0.5 font-mono text-[13px]"
            style={{
              backgroundColor: c.codeBg,
              border: `1px solid ${c.codeBorder}`,
            }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("[") && part.includes("](")) {
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          return (
            <a
              key={i}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-medium"
              style={{ color: c.avatarText }}
            >
              {linkMatch[1]}
            </a>
          );
        }
      }
      if (part.startsWith("http://") || part.startsWith("https://")) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline font-medium"
            style={{ color: c.avatarText }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="dark">
      <div
        className="relative flex h-[100dvh] w-full max-w-[100vw] overflow-x-hidden flex-col font-sans"
        style={{ backgroundColor: c.pageBg }}
      >
        {/* Navbar */}
        <nav
          className="flex h-[54px] shrink-0 items-center justify-between px-4 sm:px-6"
          style={{
            backgroundColor: c.navBg,
            borderBottom: `1px solid ${c.navBorder}`,
          }}
        >
          <div className="flex items-center gap-3">
            <GraduationLogo size="2.2em" />
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight leading-tight">
                <span style={goldTextStyle}>Josh</span>{" "}
                <span style={{ color: c.headline }}>AI</span>
              </h1>
            </div>
          </div>
        </nav>

        {/* Main chat area */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {messages.length === 0 ? (
            /* Empty state */
            <div className="flex flex-1 flex-col items-center justify-center px-4">
              <GraduationLogo size="100px" />

              <h2
                className="mt-4 text-[26px] font-bold"
                style={{ color: c.headline }}
              >
                How can I help you today?
              </h2>

              <p
                className="mt-2 max-w-[480px] text-center text-[15px]"
                style={{ color: c.sub, lineHeight: 1.6 }}
              >
                Ask me anything about JOSAA counselling, college cutoffs, IIT
                branches, or seat predictions.
              </p>

              <div className="mt-8 grid max-w-[560px] grid-cols-1 gap-3 sm:grid-cols-2">
                {dynamicSuggestions.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.title}
                      onClick={() => handleSuggestionClick(s.query)}
                      className="flex flex-col items-start rounded-[10px] p-3.5 text-left transition-colors"
                      style={{
                        backgroundColor: c.cardBg,
                        border: `1px solid ${c.cardBorder}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = c.cardHoverBorder;
                        e.currentTarget.style.backgroundColor = c.cardHoverBg;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = c.cardBorder;
                        e.currentTarget.style.backgroundColor = c.cardBg;
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={16} style={{ color: c.sparkGold }} strokeWidth={2} />
                        <span
                          className="text-[13px] font-semibold"
                          style={{ color: c.headline }}
                        >
                          {s.title}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px]" style={{ color: c.sub }}>
                        {s.query}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Messages */
            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-[720px] px-4 py-8 pb-32">
                {messages.map((msg) => (
                  <div key={msg.id} className="mb-5">
                    {msg.role === "user" ? (
                      <div className="flex flex-col items-end">
                        <div
                          className="max-w-[75%] md:max-w-[70%] rounded-[18px] rounded-br-[4px] px-4 py-3 text-[14px]"
                          style={{
                            backgroundColor: c.userMsgBg,
                            border: `1px solid ${c.userMsgBorder}`,
                            color: c.userMsgText,
                            lineHeight: 1.6,
                          }}
                        >
                          {msg.content}
                        </div>
                        <span
                          className="mt-1 text-[11px]"
                          style={{ color: c.timestampText }}
                        >
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start w-full">
                        {/* Tool calls */}
                        {(() => {
                          const latestTool = msg.toolCalls && msg.toolCalls.length > 0
                            ? msg.toolCalls[msg.toolCalls.length - 1]
                            : null;
                          if (!latestTool) return null;
                          return (
                            <div
                              key={latestTool.id}
                              className="mb-3 w-full overflow-hidden rounded-lg"
                              style={{
                                backgroundColor: c.toolBg,
                                border: `1px solid ${c.toolBorder}`,
                              }}
                            >
                              <button
                                onClick={() => toggleToolExpanded(latestTool.id)}
                                className="flex w-full items-center justify-between px-3.5 py-2"
                              >
                                <div className="flex items-center gap-2">
                                  {latestTool.status === "running" ? (
                                    <Loader2
                                      size={14}
                                      className="animate-spin"
                                      style={{ color: c.sparkGold }}
                                    />
                                  ) : (
                                    <ChevronRight
                                      size={14}
                                      style={{ color: c.toolCompleteText }}
                                    />
                                  )}
                                  <span
                                    className="text-[13px]"
                                    style={{
                                      color:
                                        latestTool.status === "running"
                                          ? c.toolText
                                          : c.toolCompleteText,
                                    }}
                                  >
                                    {latestTool.name}
                                  </span>
                                </div>
                                <ChevronDown
                                  size={14}
                                  style={{
                                    color: c.toolCompleteText,
                                    transform: expandedTools.has(latestTool.id)
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                    transition: "transform 150ms",
                                  }}
                                />
                              </button>
                              {expandedTools.has(latestTool.id) && latestTool.output && (
                                <div
                                  className="px-3.5 py-3 font-mono text-[12px] overflow-x-auto"
                                  style={{
                                    backgroundColor: c.toolExpandedBg,
                                    borderTop: `1px solid ${c.toolBorder}`,
                                    color: c.toolCompleteText,
                                  }}
                                >
                                  {latestTool.output}
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* Assistant message */}
                        {msg.content && (
                          <div className="flex max-w-[95%] md:max-w-[85%] gap-3 w-full">
                            <GraduationLogo size="2.4em" className="mt-0.5" />
                            <div
                              className="text-[14px] flex-1 min-w-0"
                              style={{ color: c.assistantText, lineHeight: 1.75 }}
                            >
                              {renderMessageContent(msg.content)}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </main>

        {/* Fixed input */}
        <div
          className="shrink-0 px-4 py-4 sm:px-6 fixed bottom-0 left-0 right-0 z-50 w-full"
          style={{
            backgroundColor: c.pageBg,
            borderTop: `1px solid ${c.navBorder}`,
            paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))'
          }}
        >
          <div className="mx-auto max-w-[720px]">
            <div
              className="relative flex items-end rounded-[14px]"
              style={{
                backgroundColor: c.inputBg,
                border: `1px solid ${c.inputBorder}`,
              }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isLoading ? "Generating response..." : "Message Josh AI..."}
                disabled={isLoading}
                rows={1}
                className={`max-h-36 w-full resize-none bg-transparent py-3.5 pl-4 pr-14 text-[16px] outline-none ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={{ color: c.inputText, lineHeight: 1.5 }}
                onFocus={(e) => {
                  const parent = e.currentTarget.parentElement;
                  if (parent) parent.style.borderColor = c.inputFocus;
                }}
                onBlur={(e) => {
                  const parent = e.currentTarget.parentElement;
                  if (parent) parent.style.borderColor = c.inputBorder;
                }}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute bottom-2.5 right-2.5 flex h-[34px] w-[34px] items-center justify-center rounded-full transition-all"
                style={{
                  background: (input.trim() && !isLoading) ? c.sendBtnActive : c.sendBtnInactive,
                  border: (input.trim() && !isLoading) ? "none" : `1px solid ${c.sendBtnInactiveBorder}`,
                }}
              >
                <ArrowUp
                  size={16}
                  strokeWidth={2.5}
                  style={{
                    color: (input.trim() && !isLoading) ? c.sendIconActive : c.sendIconInactive,
                  }}
                />
              </button>
            </div>
            <p className="mt-2 text-center text-[11px]" style={{ color: c.noteText }}>
              Josh AI can make mistakes. Always verify cutoff data from the official
              JOSAA portal.
            </p>
          </div>
          <style>{`textarea::placeholder { color: ${c.inputPlaceholder}; }`}</style>
        </div>
      </div>
    </div>
  );
}
