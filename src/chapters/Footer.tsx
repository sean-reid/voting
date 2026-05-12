import Container from "@/components/layout/Container";

const readings = [
  {
    title: "Social Choice and Individual Values",
    author: "Kenneth Arrow (1951)",
    url: "https://cowles.yale.edu/sites/default/files/files/pub/mon/m12-all.pdf",
  },
  {
    title: "Arrow's Impossibility Theorem",
    author: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/arrows-theorem/",
  },
  {
    title: "Gaming the Vote",
    author: "William Poundstone",
    url: "https://www.penguinrandomhouse.com/books/303005/gaming-the-vote-by-william-poundstone/",
  },
];

export default function Footer() {
  return (
    <footer id="further-reading" className="bg-surface py-20 md:py-28">
      <Container>
        <h2 className="font-serif text-2xl font-semibold text-ink mb-8 md:text-3xl">
          Further reading
        </h2>

        <ul className="space-y-4 mb-16">
          {readings.map((item) => (
            <li key={item.url}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <span className="text-ink font-medium group-hover:text-terracotta transition-colors duration-150">
                  {item.title}
                </span>
                <span className="block text-sm text-ink-tertiary mt-0.5">
                  {item.author}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="border-t border-border pt-6">
          <p className="text-sm text-ink-tertiary">
            An interactive explanation of Arrow's Impossibility Theorem.
          </p>
        </div>
      </Container>
    </footer>
  );
}
