import type { LucideIcon } from "lucide-react";
import { Trophy, Coins, Award, Medal, Star, ShieldCheck, Gem } from "lucide-react";

export type Honor = {
  title: string;
  org: string;
  date: string;
  amount?: string;
  detail?: string;
  icon: LucideIcon;
  accent: "cyan" | "violet" | "emerald" | "amber";
};

export const honors: Honor[] = [
  {
    title: "$10,000 Tezos Blockchain Grant",
    org: "Tezos India · Game Geeks",
    date: "Dec 2021",
    amount: "$10,000",
    detail:
      "Awarded for expanding Tezos Premier League — a decentralized gaming application and NFT marketplace on Tezos.",
    icon: Coins,
    accent: "amber",
  },
  {
    title: "30 Days of Google Cloud Completion",
    org: "Google Cloud",
    date: "Dec 2020",
    detail:
      "Completed 30 Days of Google Cloud — 11 Qwiklabs quests covering core GCP, networking, security and ML services.",
    icon: ShieldCheck,
    accent: "cyan",
  },
  {
    title: "Runner-Up — Virtual Fiesta (CODE SWORD)",
    org: "NSUT",
    date: "Jul 2020",
    amount: "₹1,500",
    detail: "Runner-up at NSUT Virtual Fiesta's CODE SWORD programming contest.",
    icon: Trophy,
    accent: "violet",
  },
  {
    title: "Runner-Up — BVEST (CODE TREK)",
    org: "BVCOE",
    date: "Oct 2017",
    amount: "₹300",
    detail: "Runner-up at BVEST CODE TREK inter-school programming competition.",
    icon: Trophy,
    accent: "violet",
  },
  {
    title: "Second Runner-Up — Force Fest (PRO SORT)",
    org: "Air Force Bal Bharati School",
    date: "Aug 2016",
    detail: "Second runner-up at Force Fest's PRO SORT inter-school coding event.",
    icon: Medal,
    accent: "emerald",
  },
  {
    title: "Second Runner-Up — Digilogous (SUDO SOLVE)",
    org: "Rukmini Devi Public School",
    date: "Aug 2016",
    amount: "₹1,500",
    detail: "Second runner-up at Digilogous SUDO SOLVE programming contest.",
    icon: Medal,
    accent: "emerald",
  },
  {
    title: "NIIT IT Wizard — Very Good",
    org: "NIIT",
    date: "Sep 2013",
    detail: "Recognized at the 'Very Good' tier in NIIT's IT Wizard national programme.",
    icon: Star,
    accent: "amber",
  },
  {
    title: "NIIT IT Wizard — Excellent",
    org: "NIIT",
    date: "Sep 2011",
    detail: "Recognized at the 'Excellent' tier in NIIT's IT Wizard national programme.",
    icon: Gem,
    accent: "amber",
  },
];

export const languages = [
  { name: "English", level: "Native or bilingual", icon: "Aa", scriptClass: "font-serif" },
  { name: "Hindi", level: "Native or bilingual", icon: "अ", scriptClass: "" },
  { name: "Japanese", level: "Elementary proficiency", icon: "日", scriptClass: "" },
  { name: "Sanskrit", level: "Limited working proficiency", icon: "ॐ", scriptClass: "" },
] as const;

export type Volunteering = {
  title: string;
  org: string;
  detail: string;
  href?: string;
  iconKey: "medium" | "youtube" | "github" | "google" | "nss" | "club" | "school";
};

export const volunteering: Volunteering[] = [
  {
    title: "Technical Writer",
    org: "Medium · @binaryphoenix01",
    href: "https://binaryphoenix01.medium.com",
    detail:
      "Long-form articles on systems performance, AI tooling, frontend craft and engineering process.",
    iconKey: "medium",
  },
  {
    title: "Educator & Creator",
    org: "YouTube",
    href: "https://www.youtube.com/channel/UCcINlOM-rC1_8yiRGH_iFBg?sub_confirmation=1",
    detail:
      "Educational videos and explainers on programming, problem-solving and software engineering.",
    iconKey: "youtube",
  },
  {
    title: "Open Source Maintainer",
    org: "GitHub · @blackphoenix42",
    href: "https://github.com/blackphoenix42",
    detail:
      "Maintain and contribute to open-source projects across visualization, AI tooling and developer experience.",
    iconKey: "github",
  },
  {
    title: "Google Crowdsource — Level 8",
    org: "Google",
    detail:
      "Contributed to Google's Crowdsource program, reaching Level 8 across image labeling, translation and validation tasks.",
    iconKey: "google",
  },
  {
    title: "NSS Volunteer",
    org: "NSUT · National Service Scheme",
    detail:
      "Participated in community service drives, awareness campaigns and on-ground volunteer work under the NSS unit.",
    iconKey: "nss",
  },
  {
    title: "Head of Programming",
    org: "Dynamix Club · Ramjas School",
    detail:
      "Led the programming wing of Dynamix Club — running DSA sessions, mock contests and mentoring junior members.",
    iconKey: "club",
  },
  {
    title: "House Captain — Jupiter House",
    org: "Ramjas School, R. K. Puram",
    detail:
      "Captained Jupiter House — organized inter-house tournaments, anchored school events and represented the house in school council activities.",
    iconKey: "school",
  },
];
