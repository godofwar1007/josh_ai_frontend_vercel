import React from "react";
import { GraduationCap } from "lucide-react";

interface GraduationLogoProps {
  size?: number | string;
  iconSizeRatio?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function GraduationLogo({
  size = "2.5em",
  iconSizeRatio = 0.55,
  className = "",
  style = {},
}: GraduationLogoProps) {
  // Use relative em units for sizing by default so it scales with font size
  const containerStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "radial-gradient(circle at center, #2C2217 0%, #15110E 100%)",
    border: "1.5px solid #C8892A",
    boxShadow: "0 0 12px rgba(232, 168, 48, 0.25), inset 0 0 8px rgba(232, 168, 48, 0.1)",
    flexShrink: 0,
    width: size,
    height: size,
    verticalAlign: "middle",
    ...style,
  };

  const finalIconSize = typeof size === "number" ? Math.round(size * iconSizeRatio) : `calc(${size} * ${iconSizeRatio})`;

  return (
    <div className={`relative ${className}`} style={containerStyle}>
      <GraduationCap
        style={{ color: "#E8A830" }}
        size={finalIconSize}
        strokeWidth={1.75}
      />
    </div>
  );
}
