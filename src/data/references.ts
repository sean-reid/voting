export interface Reference {
  id: string;
  number: number;
  author: string;
  title: string;
  publication?: string;
  year: number;
  url?: string;
  note?: string;
}

export const references: Reference[] = [
  {
    id: "arrow-1951",
    number: 1,
    author: "Kenneth J. Arrow",
    title: "Social Choice and Individual Values",
    publication: "Wiley (2nd ed. 1963)",
    year: 1951,
    url: "https://en.wikipedia.org/wiki/Social_Choice_and_Individual_Values",
  },
  {
    id: "geanakoplos-2005",
    number: 2,
    author: "John Geanakoplos",
    title: "Three Brief Proofs of Arrow's Impossibility Theorem",
    publication: "Economic Theory 26(1): 211–215",
    year: 2005,
    url: "https://doi.org/10.1007/s00199-004-0556-7",
  },
  {
    id: "sen-1970",
    number: 3,
    author: "Amartya Sen",
    title: "Collective Choice and Social Welfare",
    publication: "Harvard University Press (expanded ed. 2017)",
    year: 1970,
  },
  {
    id: "saari-2001",
    number: 4,
    author: "Donald G. Saari",
    title: "Decisions and Elections: Explaining the Unexpected",
    publication: "Cambridge University Press",
    year: 2001,
  },
  {
    id: "balinski-laraki-2010",
    number: 5,
    author: "Michel Balinski and Rida Laraki",
    title: "Majority Judgment: Measuring, Ranking, and Electing",
    publication: "MIT Press",
    year: 2010,
  },
  {
    id: "sep-arrows-theorem",
    number: 6,
    author: "Stanford Encyclopedia of Philosophy",
    title: "Arrow's Theorem",
    year: 2019,
    url: "https://plato.stanford.edu/entries/arrows-theorem/",
  },
  {
    id: "sep-social-choice",
    number: 7,
    author: "Stanford Encyclopedia of Philosophy",
    title: "Social Choice Theory",
    year: 2021,
    url: "https://plato.stanford.edu/entries/social-choice/",
  },
];

export function getRef(id: string): Reference {
  const ref = references.find((r) => r.id === id);
  if (!ref) throw new Error(`Unknown reference: ${id}`);
  return ref;
}
