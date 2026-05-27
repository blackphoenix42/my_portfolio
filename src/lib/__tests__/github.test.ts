import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchFeaturedRepos } from "@/lib/github";

describe("fetchFeaturedRepos", () => {
  const ORIGINAL_ENV = { ...process.env };
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.GITHUB_TOKEN;
  });
  afterEach(() => {
    process.env = ORIGINAL_ENV;
    vi.unstubAllGlobals();
  });

  it("returns 8 featured repos with categories", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify([]), { status: 200 })),
    );
    const out = await fetchFeaturedRepos();
    expect(out).toHaveLength(8);
    expect(out.map((r) => r.category)).toEqual(
      expect.arrayContaining(["AI", "Frontend", "Mobile", "CP", "Blockchain"]),
    );
  });

  it("merges API data when repo names match", async () => {
    const apiRepos = [
      {
        name: "algolens",
        full_name: "x/algolens",
        description: "from api",
        html_url: "https://github.com/x/algolens",
        language: "TypeScript",
        stargazers_count: 99,
        forks_count: 3,
        topics: ["t"],
        pushed_at: "2024-01-01T00:00:00Z",
        fork: false,
        archived: false,
      },
    ];
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify(apiRepos), { status: 200 })),
    );
    const out = await fetchFeaturedRepos();
    const algo = out.find((r) => r.name === "algolens")!;
    expect(algo.description).toBe("from api");
    expect(algo.stargazers_count).toBe(99);
    expect(algo.category).toBe("Frontend");
  });

  it("falls back when API returns a non-OK response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("", { status: 500 })),
    );
    const out = await fetchFeaturedRepos();
    expect(out).toHaveLength(8);
    // Fallback descriptions are present
    expect(out.find((r) => r.name === "algolens")!.description).toMatch(/algorithm/i);
  });

  it("falls back when fetch throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network");
      }),
    );
    const out = await fetchFeaturedRepos();
    expect(out).toHaveLength(8);
  });

  it("sends Authorization header when GITHUB_TOKEN is set", async () => {
    process.env.GITHUB_TOKEN = "ghp_test";
    const fetchMock = vi.fn(async () => new Response("[]", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await fetchFeaturedRepos();
    const init = (
      fetchMock.mock.calls as unknown as Array<[string, { headers: Record<string, string> }]>
    )[0]![1]!;
    expect(init.headers.Authorization).toBe("Bearer ghp_test");
  });
});
