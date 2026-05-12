import Chapter from "@/components/layout/Chapter";
import Container from "@/components/layout/Container";
import ComparisonMatrix from "@/components/interactive/ComparisonMatrix";
import Card from "@/components/ui/Card";

export default function TradeOffs() {
  return (
    <Chapter id="trade-offs">
      <Container wide>
        <h2 className="font-serif text-3xl font-semibold text-ink mb-4 md:text-4xl">
          Trade-offs in practice
        </h2>

        <p className="text-ink-secondary text-lg leading-relaxed mb-10 max-w-[48rem]">
          Arrow's theorem applies specifically to ranked voting systems with
          three or more candidates. Every such system must sacrifice at least
          one of the four criteria. Here is how common methods compare.
        </p>

        <Card padding={false} className="p-4 md:p-6 mb-8">
          <ComparisonMatrix />
        </Card>

        <div className="max-w-[48rem]">
          <p className="text-ink-secondary leading-relaxed mb-6">
            Approval voting and score voting fall outside the scope of Arrow's
            theorem because they do not use strict rankings. They come with
            their own trade-offs.
          </p>

          <p className="text-ink leading-relaxed">
            Every voting system involves trade-offs. Understanding what each
            system gives up is the starting point for choosing one.
          </p>
        </div>
      </Container>
    </Chapter>
  );
}
