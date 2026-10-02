export type SocialSignal = {
  title: string;
  url: string;
  source: string;
  seenDate: string;
};

const GDELT_ENDPOINT = "https://api.gdeltproject.org/api/v2/doc/doc";

function buildQuery(city: string, severity?: string) {
  const base = city.trim();
  switch (severity) {
    case "storm":
      return `storm ${base}`;
    case "extreme-heat":
      return `heatwave ${base}`;
    case "heavy-rain":
    case "rain":
      return `flooding OR rain ${base}`;
    default:
      return `weather ${base}`;
  }
}

function formatGdeltDate(raw: string) {
  // GDELT's seendate format is YYYYMMDDHHMMSS
  if (!raw || raw.length < 8) return "";
  const year = raw.slice(0, 4);
  const month = raw.slice(4, 6);
  const day = raw.slice(6, 8);
  return `${day}/${month}/${year}`;
}

export async function fetchSocialSignals(
  city: string,
  severity?: string
): Promise<SocialSignal[]> {
  const query = buildQuery(city, severity);
  const params = new URLSearchParams({
    query,
    mode: "artlist",
    format: "json",
    maxrecords: "6",
    sort: "datedesc",
  });

  const res = await fetch(`${GDELT_ENDPOINT}?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch social signals");

  const data = await res.json();
  const articles: unknown[] = Array.isArray(data.articles) ? data.articles : [];

  return articles.map((a) => {
    const article = a as { title?: string; url?: string; domain?: string; seendate?: string };
    return {
      title: article.title ?? "Untitled",
      url: article.url ?? "#",
      source: article.domain ?? "Unknown source",
      seenDate: formatGdeltDate(article.seendate ?? ""),
    };
  });
}