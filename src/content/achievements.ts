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
    detail: "Awarded for expanding a decentralized gaming application on Tezos.",
  },
];
