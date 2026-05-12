import CandidateNode from "./CandidateNode";
import ArrowLine from "./ArrowLine";

interface PreferenceGraphProps {
  candidates: string[];
  ranking: string[];
  colors: Record<string, string>;
  width: number;
  height: number;
}

export default function PreferenceGraph({
  candidates,
  ranking,
  colors,
  width,
  height,
}: PreferenceGraphProps) {
  const padding = 60;
  const usableHeight = height - padding * 2;
  const centerX = width / 2;
  const spacing = usableHeight / Math.max(ranking.length - 1, 1);

  const positions = new Map<string, { x: number; y: number }>();
  ranking.forEach((name, i) => {
    positions.set(name, { x: centerX, y: padding + i * spacing });
  });

  candidates.forEach((name) => {
    if (!positions.has(name)) {
      positions.set(name, { x: centerX, y: height / 2 });
    }
  });

  const arrows: { from: string; to: string }[] = [];
  for (let i = 0; i < ranking.length; i++) {
    for (let j = i + 1; j < ranking.length; j++) {
      arrows.push({ from: ranking[i]!, to: ranking[j]! });
    }
  }

  const nodeRadius = 20;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Preference ranking graph"
    >
      {arrows.map(({ from, to }) => {
        const fromPos = positions.get(from)!;
        const toPos = positions.get(to)!;
        const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
        const startX = fromPos.x + nodeRadius * Math.cos(angle);
        const startY = fromPos.y + nodeRadius * Math.sin(angle);
        const endX = toPos.x - nodeRadius * Math.cos(angle);
        const endY = toPos.y - nodeRadius * Math.sin(angle);
        return (
          <ArrowLine
            key={`${from}-${to}`}
            from={{ x: startX, y: startY }}
            to={{ x: endX, y: endY }}
            color={colors[from] || "#2d2a26"}
            animated
          />
        );
      })}
      {ranking.map((name, i) => {
        const pos = positions.get(name)!;
        return (
          <CandidateNode
            key={name}
            name={name}
            x={pos.x}
            y={pos.y}
            color={colors[name] || "#2d2a26"}
            highlighted={i === 0}
          />
        );
      })}
    </svg>
  );
}
