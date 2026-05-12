import { motion } from "motion/react";

interface Point {
  x: number;
  y: number;
}

interface ArrowLineProps {
  from: Point;
  to: Point;
  color: string;
  label?: string;
  animated?: boolean;
}

function computeControlPoint(from: Point, to: Point): Point {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const offset = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.2, 40);
  return { x: midX - dy * 0.3 + offset * 0.1, y: midY + dx * 0.3 - offset * 0.1 };
}

function computeArrowhead(to: Point, control: Point, size: number): string {
  const angle = Math.atan2(to.y - control.y, to.x - control.x);
  const p1x = to.x - size * Math.cos(angle - Math.PI / 7);
  const p1y = to.y - size * Math.sin(angle - Math.PI / 7);
  const p2x = to.x - size * Math.cos(angle + Math.PI / 7);
  const p2y = to.y - size * Math.sin(angle + Math.PI / 7);
  return `M${to.x},${to.y} L${p1x},${p1y} L${p2x},${p2y} Z`;
}

export default function ArrowLine({
  from,
  to,
  color,
  label,
  animated = false,
}: ArrowLineProps) {
  const control = computeControlPoint(from, to);
  const pathD = `M${from.x},${from.y} Q${control.x},${control.y} ${to.x},${to.y}`;
  const arrowD = computeArrowhead(to, control, 8);
  const labelX = (from.x + 2 * control.x + to.x) / 4;
  const labelY = (from.y + 2 * control.y + to.y) / 4;

  return (
    <g>
      {animated ? (
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      ) : (
        <path d={pathD} fill="none" stroke={color} strokeWidth={1.5} />
      )}
      <motion.path
        d={arrowD}
        fill={color}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: animated ? 0.7 : 0, duration: 0.3 }}
      />
      {label && (
        <motion.text
          x={labelX}
          y={labelY - 8}
          textAnchor="middle"
          fill={color}
          fontSize={11}
          fontWeight={500}
          fontFamily="inherit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: animated ? 0.5 : 0, duration: 0.3 }}
        >
          {label}
        </motion.text>
      )}
    </g>
  );
}
