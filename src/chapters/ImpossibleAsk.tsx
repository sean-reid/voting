import Chapter from "@/components/layout/Chapter";
import Container from "@/components/layout/Container";
import CriteriaCards from "@/components/interactive/CriteriaCards";
import CriteriaCircle from "@/components/diagrams/CriteriaCircle";
import ImpossibilitySandbox from "@/components/interactive/ImpossibilitySandbox";

const allSatisfied = [
  {
    name: "Unrestricted Domain",
    satisfied: true,
    description:
      "Every possible set of individual rankings is allowed as input.",
  },
  {
    name: "Unanimity (Pareto)",
    satisfied: true,
    description:
      "If every voter prefers A over B, the group ranking must place A above B.",
  },
  {
    name: "Independence of Irrelevant Alternatives",
    satisfied: true,
    description:
      "The group ranking of A vs. B depends only on individual rankings of A vs. B.",
  },
  {
    name: "Non-Dictatorship",
    satisfied: true,
    description:
      "No single voter's preference automatically determines the group outcome.",
  },
];

const circleCriteria = [
  { name: "Unrestricted Domain", satisfied: true },
  { name: "Unanimity", satisfied: true },
  { name: "IIA", satisfied: true },
  { name: "Non-Dictatorship", satisfied: true },
];

export default function ImpossibleAsk() {
  return (
    <Chapter id="impossibility">
      <Container>
        <h2 className="font-serif text-3xl font-semibold text-ink mb-4 md:text-4xl">
          The impossibility
        </h2>

        <p className="text-ink-secondary text-lg leading-relaxed mb-8">
          Here are the four criteria again. Each one, on its own, seems
          reasonable. A fair voting system should satisfy all of them.
        </p>

        <div className="mb-12">
          <CriteriaCards results={allSatisfied} />
        </div>

        <p className="text-ink text-lg leading-relaxed mb-4">
          In 1951, Kenneth Arrow proved that no ranked voting system with three
          or more candidates can satisfy all four of these properties at the
          same time.
        </p>

        <p className="text-ink-secondary leading-relaxed mb-10">
          Any ranked system that allows all possible ballots, respects
          unanimity, and is not a dictatorship will violate independence of
          irrelevant alternatives in at least some cases. There is no way
          around it.
        </p>

        <CriteriaCircle criteria={circleCriteria} />

        <p className="text-ink-secondary leading-relaxed mt-12 mb-8">
          Try building a voting rule yourself. Choose how each preference
          profile should be resolved. The checker will test your rule against
          all four criteria.
        </p>
      </Container>

      <Container wide>
        <ImpossibilitySandbox />
      </Container>
    </Chapter>
  );
}
