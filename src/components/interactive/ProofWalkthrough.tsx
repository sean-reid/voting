import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { proofSteps, type ProofStep } from "@/data/proofSteps";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const CRITERIA = [
  { label: "Unrestricted Domain", short: "UD" },
  { label: "Unanimity", short: "UN" },
  { label: "IIA", short: "IIA" },
  { label: "Non-Dictatorship", short: "ND" },
];

const DIAMOND_POSITIONS = [
  { cx: 200, cy: 52 },
  { cx: 80, cy: 140 },
  { cx: 320, cy: 140 },
  { cx: 200, cy: 228 },
];

function SetupDiagram() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full max-w-md mx-auto"
      role="img"
      aria-label="Four criteria arranged in a diamond, all satisfied with check marks"
    >
      <motion.text
        x="200"
        y="285"
        textAnchor="middle"
        className="fill-ink-secondary text-sm"
        fontFamily="var(--font-serif)"
        fontSize="14"
        fontWeight="500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        Assume all hold.
      </motion.text>

      {CRITERIA.map((criterion, i) => {
        const pos = DIAMOND_POSITIONS[i]!;
        return (
          <motion.g
            key={criterion.short}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: i * 0.15,
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <motion.rect
              x={pos.cx - 62}
              y={pos.cy - 30}
              width={124}
              height={60}
              rx={14}
              ry={14}
              className="fill-sage/15 stroke-sage"
              strokeWidth="2"
              initial={{ filter: "none" }}
              animate={{
                filter: [
                  "drop-shadow(0 0 0px rgba(91,138,114,0))",
                  "drop-shadow(0 0 8px rgba(91,138,114,0.35))",
                  "drop-shadow(0 0 4px rgba(91,138,114,0.2))",
                ],
              }}
              transition={{
                delay: i * 0.15 + 0.5,
                duration: 1.2,
                ease: "easeOut",
              }}
            />
            <text
              x={pos.cx}
              y={pos.cy - 4}
              textAnchor="middle"
              className="fill-ink"
              fontSize="11"
              fontFamily="var(--font-sans)"
              fontWeight="600"
            >
              {criterion.label}
            </text>
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15 + 0.4, duration: 0.3 }}
            >
              <circle
                cx={pos.cx}
                cy={pos.cy + 18}
                r={9}
                className="fill-sage"
              />
              <path
                d={`M${pos.cx - 4} ${pos.cy + 18} l3 3.5 l5.5 -6`}
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.g>
          </motion.g>
        );
      })}

      {[
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 3],
      ].map(([from, to]) => {
        const a = DIAMOND_POSITIONS[from!]!;
        const b = DIAMOND_POSITIONS[to!]!;
        return (
          <motion.line
            key={`${from}-${to}`}
            x1={a.cx}
            y1={a.cy + 30}
            x2={b.cx}
            y2={b.cy - 30}
            className="stroke-sage/30"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          />
        );
      })}
    </svg>
  );
}

function PivotalDiagram() {
  const voters = [1, 2, 3, 4, 5];
  const pivotalIndex = 2;

  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full max-w-md mx-auto"
      role="img"
      aria-label="Five voters in a row. Voter 3 is the pivotal voter, highlighted in terracotta. Voters 1 and 2 rank B first, voters 4 and 5 rank B last."
    >
      {voters.map((v, i) => {
        const x = 56 + i * 72;
        const y = 100;
        const isPivotal = i === pivotalIndex;
        const movedB = i <= pivotalIndex;

        return (
          <motion.g
            key={v}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            {isPivotal && (
              <motion.circle
                cx={x}
                cy={y}
                r={30}
                className="fill-terracotta/10"
                initial={{ scale: 0 }}
                animate={{
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  delay: 0.7,
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
            <circle
              cx={x}
              cy={y}
              r={22}
              className={
                isPivotal
                  ? "fill-terracotta/20 stroke-terracotta"
                  : "fill-surface stroke-border-strong"
              }
              strokeWidth={isPivotal ? 2.5 : 1.5}
            />
            <text
              x={x}
              y={y + 5}
              textAnchor="middle"
              className={
                isPivotal ? "fill-terracotta" : "fill-ink-secondary"
              }
              fontSize="14"
              fontFamily="var(--font-sans)"
              fontWeight="600"
            >
              {v}
            </text>

            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
            >
              <rect
                x={x - 22}
                y={y + 32}
                width={44}
                height={20}
                rx={6}
                className={
                  movedB
                    ? isPivotal
                      ? "fill-terracotta/15"
                      : "fill-sage/15"
                    : "fill-surface-hover"
                }
              />
              <text
                x={x}
                y={y + 46}
                textAnchor="middle"
                className={
                  movedB
                    ? isPivotal
                      ? "fill-terracotta-dark"
                      : "fill-sage-dark"
                    : "fill-ink-tertiary"
                }
                fontSize="10"
                fontFamily="var(--font-sans)"
                fontWeight="600"
              >
                {movedB ? "B 1st" : "B last"}
              </text>
            </motion.g>

            {isPivotal && (
              <motion.text
                x={x}
                y={y - 34}
                textAnchor="middle"
                className="fill-terracotta"
                fontSize="10"
                fontFamily="var(--font-serif)"
                fontWeight="600"
                fontStyle="italic"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                pivotal
              </motion.text>
            )}
          </motion.g>
        );
      })}

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        <rect
          x={40}
          y={200}
          width={130}
          height={32}
          rx={8}
          className="fill-sage/10 stroke-sage/40"
          strokeWidth="1"
        />
        <text
          x={105}
          y={220}
          textAnchor="middle"
          className="fill-sage-dark"
          fontSize="12"
          fontFamily="var(--font-sans)"
          fontWeight="500"
        >
          B ranked last
        </text>
      </motion.g>

      <motion.g
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
      >
        <line
          x1={185}
          y1={216}
          x2={215}
          y2={216}
          className="stroke-terracotta"
          strokeWidth="2"
          markerEnd="url(#arrowhead-pivot)"
        />
      </motion.g>

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
      >
        <rect
          x={230}
          y={200}
          width={130}
          height={32}
          rx={8}
          className="fill-terracotta/10 stroke-terracotta/40"
          strokeWidth="1"
        />
        <text
          x={295}
          y={220}
          textAnchor="middle"
          className="fill-terracotta-dark"
          fontSize="12"
          fontFamily="var(--font-sans)"
          fontWeight="500"
        >
          B ranked first
        </text>
      </motion.g>

      <motion.text
        x={200}
        y={260}
        textAnchor="middle"
        className="fill-ink-tertiary"
        fontSize="11"
        fontFamily="var(--font-serif)"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.4 }}
      >
        Voter 3's switch flips B from bottom to top
      </motion.text>

      <defs>
        <marker
          id="arrowhead-pivot"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            className="fill-terracotta"
          />
        </marker>
      </defs>
    </svg>
  );
}

function DictatorDiagram() {
  const pairs = [
    { label: "A vs B", angle: -40 },
    { label: "A vs C", angle: 0 },
    { label: "B vs C", angle: 40 },
  ];

  const otherVoters = [
    { x: 70, y: 60 },
    { x: 330, y: 60 },
    { x: 70, y: 220 },
    { x: 330, y: 220 },
  ];

  return (
    <svg
      viewBox="0 0 400 280"
      className="w-full max-w-md mx-auto"
      role="img"
      aria-label="The pivotal voter in the center with arrows pointing to three candidate pairs, showing they determine every outcome. Other voters are dimmed."
    >
      {otherVoters.map((pos, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <circle
            cx={pos.x}
            cy={pos.y}
            r={16}
            className="fill-surface stroke-border"
            strokeWidth="1"
          />
          <text
            x={pos.x}
            y={pos.y + 4}
            textAnchor="middle"
            className="fill-ink-tertiary"
            fontSize="11"
            fontFamily="var(--font-sans)"
            fontWeight="500"
          >
            {i + 1}
          </text>
        </motion.g>
      ))}

      <motion.g
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.circle
          cx={200}
          cy={130}
          r={42}
          className="fill-terracotta/10"
          animate={{
            r: [42, 48, 42],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <circle
          cx={200}
          cy={130}
          r={32}
          className="fill-terracotta/20 stroke-terracotta"
          strokeWidth="2.5"
        />
        <text
          x={200}
          y={126}
          textAnchor="middle"
          className="fill-terracotta"
          fontSize="11"
          fontFamily="var(--font-serif)"
          fontWeight="600"
        >
          Voter
        </text>
        <text
          x={200}
          y={140}
          textAnchor="middle"
          className="fill-terracotta-dark"
          fontSize="9"
          fontFamily="var(--font-sans)"
          fontWeight="600"
        >
          PIVOTAL
        </text>
      </motion.g>

      {pairs.map((pair, i) => {
        const targetX = 200 + Math.cos((pair.angle * Math.PI) / 180) * 130;
        const targetY = 130 + Math.sin((pair.angle * Math.PI) / 180) * 80;
        const startX = 200 + Math.cos((pair.angle * Math.PI) / 180) * 36;
        const startY = 130 + Math.sin((pair.angle * Math.PI) / 180) * 36;

        return (
          <motion.g
            key={pair.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.2, duration: 0.4 }}
          >
            <line
              x1={startX}
              y1={startY}
              x2={targetX}
              y2={targetY}
              className="stroke-terracotta/50"
              strokeWidth="1.5"
              strokeDasharray="5 3"
              markerEnd="url(#arrowhead-dictator)"
            />
            <rect
              x={targetX - 36}
              y={targetY - 14}
              width={72}
              height={28}
              rx={8}
              className="fill-surface stroke-border-strong"
              strokeWidth="1"
            />
            <text
              x={targetX}
              y={targetY + 4}
              textAnchor="middle"
              className="fill-ink"
              fontSize="12"
              fontFamily="var(--font-sans)"
              fontWeight="600"
            >
              {pair.label}
            </text>
          </motion.g>
        );
      })}

      <motion.text
        x={200}
        y={265}
        textAnchor="middle"
        className="fill-ink-tertiary"
        fontSize="11"
        fontFamily="var(--font-serif)"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.4 }}
      >
        determines every pairwise outcome
      </motion.text>

      <defs>
        <marker
          id="arrowhead-dictator"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            className="fill-terracotta/50"
          />
        </marker>
      </defs>
    </svg>
  );
}

function ContradictionDiagram() {
  return (
    <svg
      viewBox="0 0 400 310"
      className="w-full max-w-md mx-auto"
      role="img"
      aria-label="Four criteria boxes reappear but Non-Dictatorship now shows a red X. A line connects Pivotal Voter to Dictator with a strikethrough, and the word Contradiction appears."
    >
      {CRITERIA.map((criterion, i) => {
        const pos = DIAMOND_POSITIONS[i]!;
        const isBroken = i === 3;

        return (
          <motion.g
            key={criterion.short}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: i * 0.12,
              duration: 0.4,
              ease: "easeOut",
            }}
          >
            <rect
              x={pos.cx - 62}
              y={pos.cy - 30}
              width={124}
              height={60}
              rx={14}
              ry={14}
              className={
                isBroken
                  ? "fill-muted-red/15 stroke-muted-red"
                  : "fill-sage/10 stroke-sage/50"
              }
              strokeWidth={isBroken ? 2.5 : 1.5}
            />
            {isBroken && (
              <motion.rect
                x={pos.cx - 62}
                y={pos.cy - 30}
                width={124}
                height={60}
                rx={14}
                ry={14}
                fill="none"
                className="stroke-muted-red"
                strokeWidth="2.5"
                initial={{ filter: "none" }}
                animate={{
                  filter: [
                    "drop-shadow(0 0 0px rgba(184,92,92,0))",
                    "drop-shadow(0 0 10px rgba(184,92,92,0.4))",
                    "drop-shadow(0 0 5px rgba(184,92,92,0.2))",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
            <text
              x={pos.cx}
              y={pos.cy - 4}
              textAnchor="middle"
              className={isBroken ? "fill-muted-red-dark" : "fill-ink"}
              fontSize="11"
              fontFamily="var(--font-sans)"
              fontWeight="600"
            >
              {criterion.label}
            </text>

            {isBroken ? (
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                <circle
                  cx={pos.cx}
                  cy={pos.cy + 18}
                  r={9}
                  className="fill-muted-red"
                />
                <path
                  d={`M${pos.cx - 4} ${pos.cy + 14} l8 8 M${pos.cx + 4} ${pos.cy + 14} l-8 8`}
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </motion.g>
            ) : (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: i * 0.12 + 0.3, duration: 0.3 }}
              >
                <circle
                  cx={pos.cx}
                  cy={pos.cy + 18}
                  r={9}
                  className="fill-sage/60"
                />
                <path
                  d={`M${pos.cx - 4} ${pos.cy + 18} l3 3.5 l5.5 -6`}
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.g>
            )}
          </motion.g>
        );
      })}

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <text
          x={148}
          y={272}
          textAnchor="middle"
          className="fill-terracotta"
          fontSize="11"
          fontFamily="var(--font-sans)"
          fontWeight="600"
        >
          Pivotal Voter
        </text>
        <text
          x={200}
          y={272}
          textAnchor="middle"
          className="fill-ink-tertiary"
          fontSize="11"
          fontFamily="var(--font-sans)"
          fontWeight="500"
        >
          =
        </text>
        <text
          x={248}
          y={272}
          textAnchor="middle"
          className="fill-muted-red"
          fontSize="11"
          fontFamily="var(--font-sans)"
          fontWeight="600"
        >
          Dictator
        </text>
      </motion.g>

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        <text
          x={200}
          y={296}
          textAnchor="middle"
          className="fill-muted-red"
          fontSize="15"
          fontFamily="var(--font-serif)"
          fontWeight="700"
          letterSpacing="0.04em"
        >
          Contradiction
        </text>
      </motion.g>
    </svg>
  );
}

const DIAGRAMS: Record<ProofStep["diagramType"], React.FC> = {
  setup: SetupDiagram,
  pivotal: PivotalDiagram,
  dictator: DictatorDiagram,
  contradiction: ContradictionDiagram,
};

function ProofWalkthrough() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduced = useReducedMotion();

  const step = proofSteps[currentStep]!;
  const DiagramComponent = DIAGRAMS[step.diagramType];
  const isFirst = currentStep === 0;
  const isLast = currentStep === proofSteps.length - 1;

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > currentStep ? 1 : -1);
      setCurrentStep(index);
    },
    [currentStep]
  );

  const goNext = useCallback(() => {
    if (!isLast) goTo(currentStep + 1);
  }, [currentStep, isLast, goTo]);

  const goPrev = useCallback(() => {
    if (!isFirst) goTo(currentStep - 1);
  }, [currentStep, isFirst, goTo]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
      }
    },
    [goNext, goPrev]
  );

  const variants = reduced
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (d: number) => ({
          opacity: 0,
          x: d > 0 ? 60 : -60,
        }),
        center: {
          opacity: 1,
          x: 0,
        },
        exit: (d: number) => ({
          opacity: 0,
          x: d > 0 ? -60 : 60,
        }),
      };

  return (
    <Card className="overflow-hidden" padding={false}>
      <div
        className="p-6 md:p-8 focus-visible:outline-none"
        role="region"
        aria-label="Arrow's impossibility proof walkthrough"
        aria-roledescription="step-by-step walkthrough"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between mb-6">
          <Badge variant="slate">
            Step {currentStep + 1} of {proofSteps.length}
          </Badge>
          <nav
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Proof steps"
          >
            {proofSteps.map((s, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === currentStep}
                aria-label={`Step ${i + 1}: ${s.title}`}
                onClick={() => goTo(i)}
                className={`w-8 h-8 rounded-full text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                  i === currentStep
                    ? "bg-terracotta text-white shadow-sm"
                    : i < currentStep
                      ? "bg-sage/20 text-sage-dark"
                      : "bg-surface-hover text-ink-tertiary hover:bg-border hover:text-ink-secondary"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </nav>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: reduced ? 0.15 : 0.35,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            role="tabpanel"
            aria-label={`Step ${currentStep + 1}: ${step.title}`}
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
              <div className="md:w-1/2 order-2 md:order-1">
                <motion.h3
                  className="font-serif text-xl md:text-2xl font-semibold text-ink mb-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduced ? 0 : 0.1, duration: 0.3 }}
                >
                  {step.title}
                </motion.h3>
                <motion.p
                  className="text-sm md:text-base text-ink-secondary leading-relaxed"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduced ? 0 : 0.2, duration: 0.3 }}
                >
                  {step.content}
                </motion.p>
              </div>

              <div className="md:w-1/2 order-1 md:order-2">
                <div className="rounded-xl bg-paper border border-border p-4">
                  <DiagramComponent />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
          <Button
            variant="secondary"
            onClick={goPrev}
            disabled={isFirst}
            aria-label="Previous step"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1.5"
              aria-hidden="true"
            >
              <path d="M10 3 L5 8 L10 13" />
            </svg>
            Previous
          </Button>

          <p className="text-xs text-ink-tertiary hidden sm:block">
            Use arrow keys to navigate
          </p>

          <Button
            variant={isLast ? "secondary" : "primary"}
            onClick={goNext}
            disabled={isLast}
            aria-label={isLast ? "End of proof" : "Next step"}
          >
            {isLast ? "Q.E.D." : "Next"}
            {!isLast && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1.5"
                aria-hidden="true"
              >
                <path d="M6 3 L11 8 L6 13" />
              </svg>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default ProofWalkthrough;
