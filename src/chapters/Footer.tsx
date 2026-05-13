import Container from "@/components/layout/Container";
import { references } from "@/data/references";

export default function Footer() {
  return (
    <footer id="references" className="bg-surface py-20 md:py-28">
      <Container>
        <h2 className="font-serif text-2xl font-semibold text-ink mb-8 md:text-3xl">
          References
        </h2>

        <ol className="space-y-4 mb-16 list-none pl-0">
          {references.map((ref) => (
            <li key={ref.id} className="flex gap-3">
              <span className="text-sm font-medium text-ink-tertiary tabular-nums flex-shrink-0 mt-0.5">
                [{ref.number}]
              </span>
              <div>
                {ref.url ? (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <span className="text-ink font-medium group-hover:text-terracotta transition-colors duration-150">
                      {ref.title}
                    </span>
                  </a>
                ) : (
                  <span className="text-ink font-medium">{ref.title}</span>
                )}
                <span className="block text-sm text-ink-tertiary mt-0.5">
                  {ref.author}
                  {ref.publication && <>, {ref.publication}</>}
                  {" "}({ref.year})
                </span>
              </div>
            </li>
          ))}
        </ol>

        <div className="border-t border-border pt-6">
          <p className="text-sm text-ink-tertiary">
            An interactive explanation of Arrow's Impossibility Theorem.
          </p>
        </div>
      </Container>
    </footer>
  );
}
