/**
 * Official brand hexes (Simple Icons / brand guidelines) for tech marks.
 * Used so skill chips show recognizable logo colors instead of theme accents.
 */
export const TECH_BRAND_COLORS: Record<string, string> = {
  "C++": "#00599C",
  C: "#A8B9CC",
  Python: "#3776AB",
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Go: "#00ADD8",
  Java: "#ED8B00",
  Bash: "#4EAA25",
  React: "#61DAFB",
  Tailwind: "#06B6D4",
  "Tailwind CSS": "#06B6D4",
  "Node.js": "#5FA04E",
  Express: "#000000",
  Docker: "#2496ED",
  AWS: "#FF9900",
  GCP: "#4285F4",
  PostgreSQL: "#4169E1",
  MySQL: "#4479A1",
  MongoDB: "#47A248",
  Redis: "#FF4438",
  Kafka: "#231F20",
  RabbitMQ: "#FF6600",
  Git: "#F05032",
  Linux: "#FCC624",
  GraphQL: "#E10098",
  GitHub: "#181717",
  "GitHub Actions": "#2088FF",
  "Next.js": "#000000",
  Kubernetes: "#326CE5",
  OpenCV: "#5C3EE8",
  NumPy: "#013243",
  Firebase: "#DD2C00",
  Jenkins: "#D24939",
  MediaPipe: "#0097A7",
  REST: "#6B7280",
  OpenTelemetry: "#000000",
  Terraform: "#7B42BC",
  Nginx: "#009639",
  "VS Code": "#007ACC",
  Prometheus: "#E6522C",
  Grafana: "#F46800",
  Jest: "#C21325",
  Vitest: "#6E9F18",
  pytest: "#0A9EDC",
  Postman: "#FF6C37",
  CMake: "#064F8C",
};

/** Brands that need a dark tile so a light/yellow mark stays legible. */
const DARK_TILE_BRANDS = new Set([
  "JavaScript",
  "Linux",
  "Go",
  "React",
  "Express",
  "Next.js",
  "GitHub",
  "Kafka",
  "OpenTelemetry",
]);

export function getTechBrandColor(name: string): string | undefined {
  return TECH_BRAND_COLORS[name];
}

export function techBrandNeedsDarkTile(name: string): boolean {
  return DARK_TILE_BRANDS.has(name);
}
