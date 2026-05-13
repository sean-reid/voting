import { getRef } from "@/data/references";

interface CiteProps {
  id: string;
}

export default function Cite({ id }: CiteProps) {
  const ref = getRef(id);
  return (
    <a
      href="#references"
      className="text-slate hover:text-terracotta transition-colors duration-150 no-underline"
      title={`${ref.author}, "${ref.title}" (${ref.year})`}
    >
      [{ref.number}]
    </a>
  );
}
