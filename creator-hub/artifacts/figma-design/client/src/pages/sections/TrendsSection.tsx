import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Platform {
  name: string;
  rank: string;
  color: string;
  bg: string;
}

interface Trend {
  id: number;
  source: string;
  sourceColor: string;
  sourceBg: string;
  status: string;
  statusColor: string;
  statusDot: string;
  change: string;
  title: string;
  platforms: Platform[];
  angles: string[];
  strongestOn: Platform[];
}

const platformStyle: Record<string, { color: string; bg: string }> = {
  YouTube:    { color: "text-[#ff0000]",  bg: "bg-[#fff0f0]" },
  Reddit:     { color: "text-orange-500", bg: "bg-orange-50" },
  TikTok:     { color: "text-pink-600",   bg: "bg-pink-50"   },
  "X (Twitter)": { color: "text-sky-500",  bg: "bg-sky-50"   },
  Instagram:  { color: "text-purple-500", bg: "bg-purple-50" },
};

const makePlatform = (rank: string, name: string): Platform => ({
  name,
  rank,
  color: platformStyle[name]?.color ?? "text-gray-500",
  bg:    platformStyle[name]?.bg    ?? "bg-gray-100",
});

const trends: Trend[] = [
  {
    id: 1,
    source: "Reddit",
    sourceColor: "text-orange-500",
    sourceBg: "bg-orange-50",
    status: "Trending Fast",
    statusColor: "text-green-500",
    statusDot: "bg-green-500",
    change: "+320%",
    title: "Vite 6 Migration",
    platforms: [
      makePlatform("#1", "YouTube"),
      makePlatform("#2", "Reddit"),
      makePlatform("#3", "X (Twitter)"),
    ],
    angles: [
      "I migrated my entire app to Vite 6 — here's what broke",
      "Vite 6 vs Webpack: the benchmark nobody expected",
      "Stop using Vite 5 — the upgrade you're missing",
    ],
    strongestOn: [
      makePlatform("#1", "YouTube"),
      makePlatform("#2", "X (Twitter)"),
      makePlatform("#3", "Reddit"),
    ],
  },
  {
    id: 2,
    source: "TikTok",
    sourceColor: "text-pink-600",
    sourceBg: "bg-pink-50",
    status: "Peaking",
    statusColor: "text-yellow-500",
    statusDot: "bg-yellow-400",
    change: "+180%",
    title: "Cozy Desk Setups",
    platforms: [
      makePlatform("#1", "YouTube"),
      makePlatform("#2", "TikTok"),
      makePlatform("#3", "Instagram"),
    ],
    angles: [
      "I built the ultimate cozy desk setup for under $200",
      "How a 'Cozy' desk setup actually ruined my posture",
      "Upgrading my girlfriend's desk for her new job",
    ],
    strongestOn: [
      makePlatform("#1", "YouTube"),
      makePlatform("#2", "X (Twitter)"),
      makePlatform("#3", "TikTok"),
    ],
  },
  {
    id: 3,
    source: "YouTube",
    sourceColor: "text-[#ff0000]",
    sourceBg: "bg-[#fff0f0]",
    status: "Rising",
    statusColor: "text-sky-500",
    statusDot: "bg-sky-400",
    change: "+95%",
    title: "AI Coding Assistants",
    platforms: [
      makePlatform("#1", "YouTube"),
      makePlatform("#2", "X (Twitter)"),
      makePlatform("#3", "Reddit"),
    ],
    angles: [
      "I replaced my entire dev workflow with AI — honest results",
      "AI coding tools ranked: which one actually ships code",
      "Stop using Copilot for this — use this instead",
    ],
    strongestOn: [
      makePlatform("#1", "YouTube"),
      makePlatform("#2", "Reddit"),
      makePlatform("#3", "X (Twitter)"),
    ],
  },
  {
    id: 4,
    source: "X (Twitter)",
    sourceColor: "text-sky-500",
    sourceBg: "bg-sky-50",
    status: "Stable",
    statusColor: "text-gray-400",
    statusDot: "bg-gray-300",
    change: "+40%",
    title: "Solo Founder Journeys",
    platforms: [
      makePlatform("#1", "X (Twitter)"),
      makePlatform("#2", "YouTube"),
      makePlatform("#3", "TikTok"),
    ],
    angles: [
      "I built a SaaS alone for 6 months — here's what happened",
      "The loneliest part of being a solo founder nobody talks about",
      "Solo founder vs. co-founder: what I wish I knew",
    ],
    strongestOn: [
      makePlatform("#1", "X (Twitter)"),
      makePlatform("#2", "YouTube"),
      makePlatform("#3", "TikTok"),
    ],
  },
];

export const TrendsSection = (): React.JSX.Element => {
  const [selected, setSelected] = useState<Trend>(trends[0]);

  return (
    <section className="flex min-h-0 flex-1 flex-col self-stretch bg-[#fafafa] [font-family:'Inter',Helvetica]">
      <header className="z-10 flex h-14 shrink-0 items-center justify-between border-b bg-white px-4 sm:px-6">
        <h1 className="text-sm font-normal tracking-[-0.28px] text-[#ff0000]">
          Trends
        </h1>
        <span className="flex items-center gap-1.5 rounded-full bg-[#fff0f0] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#ff0000] select-none">
          ✦ Studio
        </span>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pt-6 pb-20 sm:px-6 sm:pt-8 sm:pb-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-[28px] font-bold leading-[35px] tracking-[-0.7px] text-gray-900">
            Cross-Platform Trends
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Signals from Reddit, TikTok, YouTube &amp; more — updated hourly.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
            {/* Left: Live Feed */}
            <div>
              <p className="mb-3 text-[11px] font-medium tracking-[1.1px] text-gray-400">
                LIVE FEED
              </p>
              <div className="flex flex-col gap-3">
                {trends.map((trend) => {
                  const isSelected = selected.id === trend.id;
                  return (
                    <Card
                      key={trend.id}
                      onClick={() => setSelected(trend)}
                      className={`cursor-pointer overflow-hidden rounded-2xl border transition-all duration-200 ${
                        isSelected
                          ? "border-[#ff0000] bg-white shadow-[0_8px_32px_rgba(255,0,0,0.16),0_2px_8px_rgba(0,0,0,0.07)]"
                          : "border-gray-100 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.07)] hover:border-red-200 hover:shadow-[0_6px_24px_rgba(255,0,0,0.10)]"
                      }`}
                    >
                      <CardContent className="p-4">
                        {/* Top row: source + status + change */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`h-auto rounded-full px-2 py-0.5 text-[11px] font-normal ${trend.sourceBg} ${trend.sourceColor} hover:${trend.sourceBg} border-0`}
                            >
                              {trend.source}
                            </Badge>
                            <span className="flex items-center gap-1 text-[11px] text-gray-500">
                              <span className={`h-1.5 w-1.5 rounded-full ${trend.statusDot}`} />
                              <span className={trend.statusColor}>{trend.status}</span>
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-green-500">
                            ↗ {trend.change}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="mt-2 text-[16px] font-semibold text-gray-900">
                          {trend.title}
                        </h3>

                        {/* Platform rankings */}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {trend.platforms.map((p) => (
                            <Badge
                              key={p.name}
                              className={`h-auto rounded-full px-2 py-0.5 text-[11px] font-normal border-0 ${p.bg} ${p.color} hover:${p.bg}`}
                            >
                              {p.rank} {p.name}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Right: Trend Multiplier */}
            <div>
              <p className="mb-3 text-[11px] font-medium tracking-[1.1px] text-gray-400">
                TREND MULTIPLIER
              </p>
              <Card className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_8px_36px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)]">
                <CardContent className="p-5 relative">
                  {/* subtle top-right glow */}
                  <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full blur-2xl bg-red-400 opacity-[0.06]" aria-hidden="true" />
                  <p className="text-[11px] font-medium tracking-[1.1px] text-[#ff0000]">
                    BASE TREND
                  </p>
                  <h3 className="mt-1 text-[22px] font-bold leading-[30px] tracking-[-0.5px] text-gray-900">
                    {selected.title}
                  </h3>
                  <p className="mt-1 text-[13px] text-gray-400">
                    {selected.angles.length} high-converting angles for this trend
                  </p>

                  <div className="mt-4 flex flex-col gap-2">
                    {selected.angles.map((angle, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-xl border border-gray-100 px-4 py-3"
                      >
                        <span className="mt-0.5 shrink-0 text-[13px] font-semibold text-gray-300">
                          {i + 1}
                        </span>
                        <p className="text-[13px] leading-[20px] text-gray-900">{angle}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5">
                    <p className="mb-2 text-[11px] text-gray-400">Trending strongest on:</p>
                    <div className="flex flex-col gap-1.5">
                      {selected.strongestOn.map((p) => (
                        <div
                          key={p.name}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 ${p.bg}`}
                        >
                          <span className={`text-[12px] font-semibold ${p.color}`}>{p.rank}</span>
                          <span className={`text-[12px] font-medium ${p.color}`}>{p.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};
