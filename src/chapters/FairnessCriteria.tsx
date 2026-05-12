import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Chapter from "@/components/layout/Chapter";
import Container from "@/components/layout/Container";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import SpoilerDemo from "@/components/interactive/SpoilerDemo";
import DictatorDetector from "@/components/interactive/DictatorDetector";

const ALL_ORDERINGS = [
  ["A", "B", "C"],
  ["A", "C", "B"],
  ["B", "A", "C"],
  ["B", "C", "A"],
  ["C", "A", "B"],
  ["C", "B", "A"],
];

function CriterionNumber({ n }: { n: number }) {
  return (
    <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-terracotta/15 text-sm font-semibold text-terracotta">
      {n}
    </span>
  );
}

function SubSection({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <CriterionNumber n={number} />
        <h3 className="font-serif text-xl font-semibold md:text-2xl">
          {title}
        </h3>
      </div>
      {children}
    </motion.div>
  );
}

function UnrestrictedDomain() {
  return (
    <SubSection number={1} title="Every ordering is allowed">
      <p className="max-w-prose text-ink-secondary">
        Any voter should be free to rank the candidates in any order. No
        preferences are forbidden or excluded in advance.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {ALL_ORDERINGS.map((ordering) => (
          <Card key={ordering.join("-")} className="text-center">
            <div className="space-y-1.5">
              {ordering.map((c, i) => (
                <div key={c} className="flex items-center justify-center gap-2">
                  <span className="text-xs text-ink-tertiary">{i + 1}.</span>
                  <Badge
                    variant={
                      c === "A"
                        ? "terracotta"
                        : c === "B"
                          ? "sage"
                          : "slate"
                    }
                  >
                    {c}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <p className="text-sm text-ink-tertiary">
        With 3 candidates, there are 6 possible orderings. A fair system
        accepts all of them.
      </p>
    </SubSection>
  );
}

function Unanimity() {
  const voterRanking = ["A", "B", "C"];

  return (
    <SubSection number={2} title="Unanimous preferences are respected">
      <p className="max-w-prose text-ink-secondary">
        If every voter prefers A over B, the group ranking should too. This is
        also called Pareto efficiency.
      </p>
      <div className="grid gap-4 sm:grid-cols-4">
        {[1, 2, 3].map((n) => (
          <Card key={n}>
            <p className="mb-2 text-xs font-medium text-ink-tertiary">
              Voter {n}
            </p>
            <div className="space-y-1">
              {voterRanking.map((c, i) => (
                <div key={c} className="flex items-center gap-2 text-sm">
                  <span className="text-xs text-ink-tertiary">{i + 1}.</span>
                  <span className="text-ink">{c}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
        <Card className="flex flex-col items-center justify-center border-terracotta/30 bg-terracotta/5">
          <p className="mb-2 text-xs font-medium text-terracotta">
            Group result
          </p>
          <div className="space-y-1">
            {voterRanking.map((c, i) => (
              <div key={c} className="flex items-center gap-2 text-sm">
                <span className="text-xs text-terracotta/60">{i + 1}.</span>
                <span className="font-medium text-terracotta-dark">{c}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <p className="text-sm text-ink-tertiary">
        When every voter ranks A above B, the group must rank A above B. A
        system that violated this would override a unanimous preference.
      </p>
    </SubSection>
  );
}

function IndependenceOfIrrelevantAlternatives() {
  return (
    <SubSection number={3} title="Unrelated candidates don't change the outcome">
      <p className="max-w-prose text-ink-secondary">
        The group's ranking of A versus B should depend only on individual
        rankings of A versus B - not on how voters feel about some third
        candidate C.
      </p>
      <SpoilerDemo />
    </SubSection>
  );
}

function NonDictatorship() {
  return (
    <SubSection number={4} title="No single voter controls everything">
      <p className="max-w-prose text-ink-secondary">
        There should be no voter whose preference always becomes the group's
        decision, regardless of what everyone else wants.
      </p>
      <DictatorDetector />
    </SubSection>
  );
}

export default function FairnessCriteria() {
  return (
    <Chapter id="fairness-criteria">
      <Container wide>
        <h2 className="mb-3 font-serif text-3xl font-semibold md:text-4xl">
          What would a fair system look like?
        </h2>
        <p className="mb-16 max-w-prose text-ink-secondary">
          Before Arrow's theorem, let's define what "fair" might mean. Here are
          four reasonable-sounding properties.
        </p>

        <div className="space-y-20">
          <UnrestrictedDomain />
          <Unanimity />
          <IndependenceOfIrrelevantAlternatives />
          <NonDictatorship />
        </div>
      </Container>
    </Chapter>
  );
}
