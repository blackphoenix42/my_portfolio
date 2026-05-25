export type Achievement = {
  platform: string;
  rank: string;
  rating?: number;
  detail?: string;
  handle: string;
  href: string;
  accent: "cyan" | "violet" | "emerald" | "amber";
};

export const competitive: Achievement[] = [
  {
    platform: "CodeChef",
    rank: "6-Star",
    rating: 2353,
    detail: "AIR 29",
    handle: "BlackPhoenix42",
    href: "https://codechef.com/users/blackphoenix42",
    accent: "amber",
  },
  {
    platform: "Codeforces",
    rank: "Master",
    rating: 2264,
    detail: "AIR 13",
    handle: "BinaryPhoenix10",
    href: "https://codeforces.com/profile/BinaryPhoenix10",
    accent: "violet",
  },
  {
    platform: "LeetCode",
    rank: "Knight",
    rating: 2124,
    detail: "Global Top 1%",
    handle: "BinaryPhoenix",
    href: "https://leetcode.com/u/BinaryPhoenix/",
    accent: "cyan",
  },
  {
    platform: "HackerRank",
    rank: "6-Star Problem Solver",
    handle: "BinaryPhoenix",
    href: "https://www.hackerrank.com/profile/BinaryPhoenix",
    accent: "emerald",
  },
];

export const otherAchievements = [
  {
    title: "$10,000 Tezos Blockchain Grant",
    detail:
      "Awarded for expanding a decentralized gaming application and NFT marketplace on Tezos.",
  },
  {
    title: "Competitive Programming Podiums",
    detail:
      "Multiple podium finishes across NSUT, BVCOE, Rukmini Devi and Apeejay programming contests.",
  },
  {
    title: "Academic Excellence",
    detail: "Gold and Silver Medalist; B.Tech in CSE from NSUT East Campus with 8.32/10 CGPA.",
  },
  {
    title: "Programming Leadership",
    detail:
      "Head of Programming at Dynamix Club, leading programming events and CodeChef contests.",
  },
  {
    title: "Teaching & Community",
    detail:
      "Mentored 100+ students in software development and competitive programming; Google Crowdsource Level 8 and Stack Overflow contributor.",
  },
  {
    title: "Certifications",
    detail:
      "JP Morgan SWE Virtual Experience, AWS Fundamentals, 11 Google Cloud Qwiklabs badges, NIIT Python/Data/Java, and HackerRank certifications across SQL, REST API, React, Node.js, Go, CSS and frontend/SWE skills.",
  },
];
