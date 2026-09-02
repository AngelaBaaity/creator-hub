import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface ValidationResult {
  score: number;
  label: string;
  reasoning: string;
  suggestion: string;
}

export const ContentDashboardSection = (): React.JSX.Element => {
  const [ideaInput, setIdeaInput] = useState(
    "I tried to live without a smartphone for 7 days"
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>({
    score: 82,
    label: "High Potential",
    reasoning:
      "Challenges involving dopamine detox are highly evergreen. The '7 days' format gives the viewer a clear expectation of the narrative arc.",
    suggestion: "Increase the stakes. Try 30 days instead of 7.",
  });
  const [error, setError] = useState<string | null>(null);

  const handleValidate = async (idea: string) => {
    if (!idea.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim() }),
      });
      if (!res.ok) throw new Error("Validation failed");
      const data = (await res.json()) as ValidationResult;
      setResult(data);
    } catch {
      setError("Could not reach the AI — please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor =
    result && result.score >= 70
      ? "text-green-500"
      : result && result.score >= 40
        ? "text-yellow-500"
        : "text-red-500";

  const badgeBg =
    result && result.score >= 70
      ? "bg-[#22c55e18] text-green-500 hover:bg-[#22c55e18]"
      : result && result.score >= 40
        ? "bg-yellow-50 text-yellow-500 hover:bg-yellow-50"
        : "bg-[#fff0f0] text-[#ff0000] hover:bg-[#fff0f0]";

  return (
    <section className="flex min-h-0 flex-1 flex-col self-stretch bg-[#fafafa] [font-family:'Inter',Helvetica]">
      <header className="z-10 flex h-14 shrink-0 items-center justify-between border-b bg-white px-4 sm:px-6">
        <h1 className="text-sm font-normal tracking-[-0.28px] text-[#ff0000]">
          Dashboard
        </h1>
        <span className="flex items-center gap-1.5 rounded-full bg-[#fff0f0] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#ff0000] select-none">
          ✦ Studio
        </span>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-20 sm:px-8 sm:pb-8 lg:px-[162px]">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-8">
          <section aria-labelledby="content-heading">
            <p className="text-xs font-medium tracking-[1.2px] text-[#ff0000]">
              GOOD MORNING
            </p>
            <h2
              id="content-heading"
              className="mt-1 text-[28px] font-bold leading-[35px] tracking-[-0.7px] text-gray-900"
            >
              Top content for today
            </h2>
          </section>

          {/* Top opportunity card */}
          <Card className="relative overflow-hidden rounded-2xl border border-red-100/60 bg-white shadow-[0_8px_40px_rgba(255,0,0,0.13),0_2px_10px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_12px_48px_rgba(255,0,0,0.18),0_4px_14px_rgba(0,0,0,0.10)]">
            <div
              className="pointer-events-none absolute right-px top-[9px] h-40 w-40 rounded-full blur-[32px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,0,0,1)_0%,rgba(255,0,0,0)_70%)] opacity-[0.10]"
              aria-hidden="true"
            />
            {/* subtle sparkle dots */}
            <div className="pointer-events-none absolute left-5 top-5 h-1 w-1 rounded-full bg-red-300 opacity-40" aria-hidden="true" />
            <div className="pointer-events-none absolute left-9 top-3 h-0.5 w-0.5 rounded-full bg-red-400 opacity-30" aria-hidden="true" />
            <CardContent className="relative flex items-start justify-between gap-6 p-6 pt-8">
              <div className="flex min-w-0 flex-1 flex-col items-start gap-[7px]">
                <Badge className="h-auto gap-1.5 rounded-full bg-[#fff0f0] px-2.5 py-1 text-[11px] font-normal leading-[16.5px] text-[#ff0000] hover:bg-[#fff0f0]">
                  <img
                    className="h-3 w-3"
                    alt=""
                    aria-hidden="true"
                    src="/figmaAssets/svg-7.svg"
                  />
                  Top Opportunity
                </Badge>
                <h3 className="pt-[5px] text-[22px] font-bold leading-[33px] tracking-[-0.55px] text-gray-900">
                  React 19 Server Components
                </h3>
                <p className="pb-[13.75px] text-sm font-normal leading-[22.8px] text-gray-500">
                  Search volume is up 1400% this week, but tutorial supply is low.
                </p>
                <Button
                  type="button"
                  className="h-[39.5px] rounded-xl bg-[#ff0000] px-3 text-[13px] font-normal leading-[19.5px] text-white shadow-[0px_1px_2px_#0000000d] hover:bg-[#e60000]"
                  onClick={() => {
                    setIdeaInput("React 19 Server Components tutorial for beginners");
                    window.scrollTo({ top: 999, behavior: "smooth" });
                  }}
                >
                  Validate this idea
                  <img
                    className="ml-1 h-4 w-4"
                    alt=""
                    aria-hidden="true"
                    src="/figmaAssets/svg-9.svg"
                  />
                </Button>
              </div>
              <aside className="hidden shrink-0 rounded-xl border border-gray-100 bg-neutral-50 p-4 text-center sm:block">
                <p className="pb-1 text-[11px] font-medium leading-[16.5px] text-gray-500">
                  Search Volume
                </p>
                <p className="text-[28px] font-bold leading-[42px] text-green-500">
                  +1400%
                </p>
                <p className="text-[11px] font-normal leading-[16.5px] text-gray-400">
                  this week
                </p>
              </aside>
            </CardContent>
          </Card>

          {/* Idea Validator */}
          <div className="flex items-center gap-3" aria-label="Idea validator">
            <Separator className="flex-1 bg-gray-200" />
            <span className="shrink-0 text-[11px] font-normal leading-[16.5px] tracking-[0.55px] text-gray-400">
              IDEA VALIDATOR
            </span>
            <Separator className="flex-1 bg-gray-200" />
          </div>

          <Card className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_8px_36px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_12px_44px_rgba(0,0,0,0.13),0_3px_10px_rgba(0,0,0,0.07)]">
            <CardContent className="p-0">
              <form
                className="flex flex-col gap-3 border-b border-gray-100 p-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleValidate(ideaInput);
                }}
              >
                <div className="flex items-center gap-2">
                  <img
                    className="h-4 w-4"
                    alt=""
                    aria-hidden="true"
                    src="/figmaAssets/svg-3.svg"
                  />
                  <label
                    htmlFor="idea-title"
                    className="text-[13px] font-normal leading-[19.5px] text-gray-900"
                  >
                    Validate Your Idea
                  </label>
                </div>
                <Input
                  id="idea-title"
                  value={ideaInput}
                  onChange={(e) => setIdeaInput(e.target.value)}
                  className="h-[76px] rounded-xl border-transparent bg-gray-100 px-4 text-[15px] font-medium leading-[24.4px] text-gray-900 focus-visible:ring-0"
                />
                <div className="flex flex-col gap-3 pt-1.5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-normal leading-[18px] text-gray-400">
                    AI will analyze demand, competition &amp; audience fit
                  </p>
                  <Button
                    type="submit"
                    disabled={loading || !ideaInput.trim()}
                    className="h-[39.5px] self-end rounded-xl bg-gray-900 px-5 text-[13px] font-normal leading-[19.5px] text-white hover:bg-gray-800 disabled:opacity-60 sm:self-auto"
                  >
                    {loading ? (
                      <>
                        <span className="mr-2 inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Analyzing…
                      </>
                    ) : (
                      <>
                        <img
                          className="mr-2 h-3.5 w-3.5"
                          alt=""
                          aria-hidden="true"
                          src="/figmaAssets/svg-1.svg"
                        />
                        Validate
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {error && (
                <p className="px-6 pt-4 text-sm text-red-500">{error}</p>
              )}

              {result && !loading && (
                <>
                <section
                  className="grid gap-6 p-6 pt-0 lg:grid-cols-[144px_minmax(0,1fr)]"
                  aria-label="Idea validation results"
                >
                  {/* Score circle */}
                  <div className="flex flex-col items-center justify-center pt-6 lg:py-[23.19px]">
                    <div className="relative flex h-36 w-36 items-center justify-center">
                      <img
                        className="h-full w-full"
                        alt="Potential score progress"
                        src="/figmaAssets/svg-6.svg"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-[26px] font-bold leading-[39px] ${scoreColor}`}>
                          {result.score}
                        </span>
                        <span className="text-[11px] font-normal leading-[16.5px] text-gray-500">
                          / 100
                        </span>
                      </div>
                    </div>
                    <Badge className={`mt-2 h-auto rounded-full px-2.5 py-0.5 text-xs font-normal leading-[18px] ${badgeBg}`}>
                      {result.label}
                    </Badge>
                  </div>

                  {/* Analysis panels */}
                  <div className="flex min-w-0 flex-col gap-4 pt-6">
                    <article className="flex gap-2.5 rounded-xl border border-transparent bg-gray-100 p-4">
                      <img
                        className="mt-px h-[18px] w-4 shrink-0"
                        alt=""
                        aria-hidden="true"
                        src="/figmaAssets/svg-margin.svg"
                      />
                      <div>
                        <h4 className="text-[11px] font-normal leading-[16.5px] tracking-[0.28px] text-gray-500">
                          AI REASONING
                        </h4>
                        <p className="mt-[3px] text-[13px] font-normal leading-[21.1px] text-gray-900">
                          {result.reasoning}
                        </p>
                      </div>
                    </article>

                    <article className="flex gap-2.5 rounded-xl border border-[#ffe0e0] bg-[#fff0f0] p-4">
                      <img
                        className="mt-px h-[18px] w-4 shrink-0"
                        alt=""
                        aria-hidden="true"
                        src="/figmaAssets/svg-margin-1.svg"
                      />
                      <div>
                        <h4 className="text-[11px] font-normal leading-[16.5px] tracking-[0.28px] text-[#ff0000]">
                          SUGGESTIONS TO IMPROVE
                        </h4>
                        <p className="mt-[3px] text-[13px] font-normal leading-[21.1px] text-gray-900">
                          {result.suggestion}
                        </p>
                      </div>
                    </article>

                    <p className="flex items-center gap-2 text-xs font-normal leading-[18px] text-green-500">
                      <img
                        className="h-3.5 w-3.5"
                        alt=""
                        aria-hidden="true"
                        src="/figmaAssets/svg.svg"
                      />
                      Analysis complete · Powered by CreatorHub AI
                    </p>
                  </div>
                </section>

                {/* Google Calendar CTA */}
                <div className="border-t border-gray-100 px-6 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[12px] text-gray-400">Schedule time to work on this idea</p>
                  <a
                    href={(() => {
                      const start = new Date();
                      start.setDate(start.getDate() + 1);
                      start.setHours(10, 0, 0, 0);
                      const end = new Date(start);
                      end.setHours(11, 0, 0, 0);
                      const fmt = (d: Date) =>
                        d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
                      const params = new URLSearchParams({
                        action: "TEMPLATE",
                        text: `📹 ${ideaInput}`,
                        details: `Validated by CreatorHub AI\nScore: ${result.score}/100 — ${result.label}\n\n${result.reasoning}\n\nSuggestion: ${result.suggestion}`,
                        dates: `${fmt(start)}/${fmt(end)}`,
                      });
                      return `https://calendar.google.com/calendar/render?${params.toString()}`;
                    })()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#4285F4]/30 bg-[#f0f4ff] px-4 py-2 text-[13px] font-normal text-[#4285F4] transition-colors hover:bg-[#e3ebff] sm:w-auto"
                  >
                    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={2} />
                      <path d="M16 2v4M8 2v4M3 10h18" strokeWidth={2} strokeLinecap="round" />
                    </svg>
                    Add to Google Calendar
                  </a>
                </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </section>
  );
};
