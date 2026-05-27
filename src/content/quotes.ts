export type Quote = {
  text: string;
  author: string;
  tone: "funny" | "motivational";
};

export const quotes: Quote[] = [
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
    tone: "funny",
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    tone: "motivational",
  },
  {
    text: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
    tone: "motivational",
  },
  {
    text: "It's not a bug — it's an undocumented feature.",
    author: "Anonymous",
    tone: "funny",
  },
  {
    text: "Premature optimization is the root of all evil.",
    author: "Donald Knuth",
    tone: "motivational",
  },
  {
    text: "Walking on water and developing software from a specification are easy if both are frozen.",
    author: "Edward V. Berard",
    tone: "funny",
  },
  {
    text: "Simplicity is the soul of efficiency.",
    author: "Austin Freeman",
    tone: "motivational",
  },
  {
    text: "There are only two hard things in Computer Science: cache invalidation and naming things.",
    author: "Phil Karlton",
    tone: "funny",
  },
  {
    text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson",
    tone: "motivational",
  },
  {
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
    tone: "motivational",
  },
  {
    text: "Weeks of coding can save you hours of planning.",
    author: "Anonymous",
    tone: "funny",
  },
  {
    text: "The best error message is the one that never shows up.",
    author: "Thomas Fuchs",
    tone: "motivational",
  },
  {
    text: "Debugging is twice as hard as writing the code in the first place.",
    author: "Brian Kernighan",
    tone: "motivational",
  },
  {
    text: "If debugging is the process of removing bugs, then programming must be the process of putting them in.",
    author: "Edsger W. Dijkstra",
    tone: "funny",
  },
  {
    text: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
    tone: "motivational",
  },
];
