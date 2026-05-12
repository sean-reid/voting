import { motion } from "motion/react";

interface CandidateNodeProps {
  name: string;
  x: number;
  y: number;
  color: string;
  highlighted?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: { width: 100, height: 32, fontSize: 12, rx: 16 },
  md: { width: 140, height: 40, fontSize: 14, rx: 20 },
  lg: { width: 180, height: 50, fontSize: 16, rx: 25 },
};

export default function CandidateNode({
  name,
  x,
  y,
  color,
  highlighted = false,
  size = "md",
}: CandidateNodeProps) {
  const { width, height, fontSize, rx } = sizeConfig[size];
  const filterId = `glow-${name.replace(/\s+/g, "-")}`;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      {highlighted && (
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
      <rect
        x={x - width / 2}
        y={y - height / 2}
        width={width}
        height={height}
        rx={rx}
        fill={color}
        opacity={0.15}
        stroke={color}
        strokeWidth={highlighted ? 2.5 : 1.5}
        filter={highlighted ? `url(#${filterId})` : undefined}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize={fontSize}
        fontWeight={600}
        fontFamily="inherit"
      >
        {name}
      </text>
    </motion.g>
  );
}
