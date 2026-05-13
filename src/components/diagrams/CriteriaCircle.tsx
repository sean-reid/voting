import { motion } from "motion/react";

interface Criterion {
  name: string;
  satisfied: boolean;
}

interface CriteriaCircleProps {
  criteria: Criterion[];
}

const SATISFIED_COLOR = "#5b8a72";
const VIOLATED_COLOR = "#b85c5c";
const INK_COLOR = "#2d2a26";

const diamondPositions = [
  { x: 250, y: 40 },
  { x: 420, y: 150 },
  { x: 250, y: 260 },
  { x: 80, y: 150 },
];

function getPositions(count: number): { x: number; y: number }[] {
  if (count <= 4) return diamondPositions.slice(0, count);
  const cx = 250;
  const cy = 150;
  const radius = 160;
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });
}

export default function CriteriaCircle({ criteria }: CriteriaCircleProps) {
  const positions = getPositions(criteria.length);
  const cardWidth = 130;
  const cardHeight = 44;
  const rx = 12;

  const lines: { from: number; to: number }[] = [];
  for (let i = 0; i < criteria.length; i++) {
    for (let j = i + 1; j < criteria.length; j++) {
      lines.push({ from: i, to: j });
    }
  }

  return (
    <svg
      viewBox="0 0 500 300"
      className="w-full max-w-[500px] h-auto mx-auto"
      role="img"
      aria-label="Criteria diagram"
    >
      <defs>
        <filter id="criteria-glow-satisfied" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {lines.map(({ from, to }) => {
        const pFrom = positions[from]!;
        const pTo = positions[to]!;
        return (
        <motion.line
          key={`line-${from}-${to}`}
          x1={pFrom.x}
          y1={pFrom.y}
          x2={pTo.x}
          y2={pTo.y}
          stroke={INK_COLOR}
          strokeWidth={1}
          strokeOpacity={0.15}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        );
      })}

      {criteria.map((criterion, i) => {
        const pos = positions[i]!;
        const color = criterion.satisfied ? SATISFIED_COLOR : VIOLATED_COLOR;
        return (
          <motion.g
            key={criterion.name}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.45,
              delay: 0.15 * i,
              ease: "easeOut",
            }}
            style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
          >
            <rect
              x={pos.x - cardWidth / 2}
              y={pos.y - cardHeight / 2}
              width={cardWidth}
              height={cardHeight}
              rx={rx}
              fill="#fdfaf6"
            />
            <rect
              x={pos.x - cardWidth / 2}
              y={pos.y - cardHeight / 2}
              width={cardWidth}
              height={cardHeight}
              rx={rx}
              fill={color}
              fillOpacity={0.12}
              stroke={color}
              strokeWidth={criterion.satisfied ? 2 : 1.5}
            />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={color}
              fontSize={12}
              fontWeight={600}
              fontFamily="inherit"
            >
              {criterion.name}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
