import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface Hook {
  type: string;
  title: string;
}

interface Metadata {
  description: string;
  hashtags: string[];
  tags: string[];
}

// Color config per hook type
const typeStyle: Record<string, { color: string; bg: string; dot: string }> = {
  "The Curiosity Gap": { color: "text-indigo-600", bg: "bg-indigo-50",  dot: "●" },
  "The Warning":       { color: "text-amber-500",  bg: "bg-amber-50",   dot: "⚠" },
  "The Time-Frame":    { color: "text-green-600",  bg: "bg-green-50",   dot: "◷" },
  "The Challenge":     { color: "text-purple-600", bg: "bg-purple-50",  dot: "⚡" },
  "The Contrarian":    { color: "text-orange-500", bg: "bg-orange-50",  dot: "↺" },
  "The How-To":        { color: "text-teal-600",   bg: "bg-teal-50",    dot: "✓" },
  "The Confession":    { color: "text-rose-500",   bg: "bg-rose-50",    dot: "♡" },
  "The Comparison":    { color: "text-sky-500",    bg: "bg-sky-50",     dot: "⇄" },
};

const conceptAccents = [
  { border: "border-indigo-100", bg: "bg-indigo-50/60", num: "text-indigo-400", label: "bg-indigo-100 text-indigo-600" },
  { border: "border-amber-100",  bg: "bg-amber-50/60",  num: "text-amber-400",  label: "bg-amber-100 text-amber-600"  },
  { border: "border-rose-100",   bg: "bg-rose-50/60",   num: "text-rose-400",   label: "bg-rose-100 text-rose-600"    },
];

const getTypeStyle = (type: string) =>
  typeStyle[type] ?? { color: "text-gray-500", bg: "bg-gray-100", dot: "●" };

export const TitleHookSection = (): React.JSX.Element => {
  const [titleInput, setTitleInput]         = useState("");
  const [hooks, setHooks]                   = useState<Hook[]>([]);
  const [hooksLoading, setHooksLoading]     = useState(false);
  const [hooksError, setHooksError]         = useState<string | null>(null);

  const [selectedIdx, setSelectedIdx]       = useState<number>(0);
  const [metadata, setMetadata]             = useState<Metadata | null>(null);
  const [metaLoading, setMetaLoading]       = useState(false);
  const [metaError, setMetaError]           = useState<string | null>(null);
  const [copied, setCopied]                 = useState(false);

  const [concepts, setConcepts]             = useState<string[]>([]);
  const [conceptsLoading, setConceptsLoading] = useState(false);
  const [conceptsError, setConceptsError]   = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    setHooksLoading(true);
    setHooksError(null);
    setHooks([]);
    setMetadata(null);
    setConcepts([]);
    setSelectedIdx(0);
    try {
      const res = await fetch("/api/title-hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: titleInput.trim() }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = (await res.json()) as { hooks?: Hook[] };
      setHooks(data.hooks ?? []);
      setSelectedIdx(0);
    } catch {
      setHooksError("Could not reach the AI — check your connection and try again.");
    } finally {
      setHooksLoading(false);
    }
  };

  const handleGenerateMetadata = async () => {
    const selectedHook = hooks[selectedIdx];
    if (!selectedHook) return;
    setMetaLoading(true);
    setMetaError(null);
    setMetadata(null);
    try {
      const res = await fetch("/api/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: selectedHook.title }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = (await res.json()) as Metadata;
      setMetadata(data);
    } catch {
      setMetaError("Could not generate metadata — try again.");
    } finally {
      setMetaLoading(false);
    }
  };

  const handleGenerateConcepts = async () => {
    const selectedHook = hooks[selectedIdx];
    if (!selectedHook) return;
    setConceptsLoading(true);
    setConceptsError(null);
    setConcepts([]);
    try {
      const res = await fetch("/api/thumbnail-concepts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: selectedHook.title }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = (await res.json()) as { concepts?: string[] };
      setConcepts(data.concepts ?? []);
    } catch {
      setConceptsError("Could not generate concepts — try again.");
    } finally {
      setConceptsLoading(false);
    }
  };

  const handleCopyAll = () => {
    if (!metadata || !hooks[selectedIdx]) return;
    const text = [
      `TITLE\n${hooks[selectedIdx].title}`,
      `\nDESCRIPTION\n${metadata.description}`,
      `\nHASHTAGS\n${metadata.hashtags.join(" ")}`,
      `\nTAGS\n${metadata.tags.join(", ")}`,
    ].join("\n");
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col self-stretch bg-[#fafafa] [font-family:'Inter',Helvetica]">
      <header className="z-10 flex h-14 shrink-0 items-center justify-between border-b bg-white px-4 sm:px-6">
        <h1 className="text-sm font-normal tracking-[-0.28px] text-[#ff0000]">
          Title Hook
        </h1>
        <span className="flex items-center gap-1.5 rounded-full bg-[#fff0f0] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#ff0000] select-none">
          ✦ Studio
        </span>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pt-6 pb-20 sm:px-6 sm:pt-8 sm:pb-8">
        <div className="mx-auto max-w-3xl flex flex-col gap-6">

          {/* Page heading */}
          <div className="rounded-2xl border border-gray-100/80 bg-white px-6 py-5 shadow-[0_2px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
            <h2 className="text-[28px] font-bold leading-[35px] tracking-[-0.7px] text-gray-900">
              Title Hook Generator
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Transform any boring title into a high-CTR hook.
            </p>
          </div>

          {/* Input card */}
          <Card className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_8px_36px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_12px_44px_rgba(0,0,0,0.13)]">
            <CardContent className="p-6">
              <p className="mb-2 text-[11px] font-medium tracking-[1.1px] text-gray-400">
                ORIGINAL TITLE
              </p>
              <form onSubmit={handleGenerate} className="flex flex-col gap-3 sm:flex-row">
                <Input
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="e.g. How to fix your bad posture"
                  className="flex-1 h-[44px] rounded-xl border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 focus-visible:ring-1 focus-visible:ring-[#ff0000]"
                />
                <Button
                  type="submit"
                  disabled={hooksLoading || !titleInput.trim()}
                  className="h-[44px] w-full sm:w-auto rounded-xl bg-gray-900 px-5 text-[13px] font-normal text-white hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {hooksLoading ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <img className="h-3.5 w-3.5" src="/figmaAssets/svg-1.svg" alt="" aria-hidden="true" />
                      Generate Hooks
                    </>
                  )}
                </Button>
              </form>
              {hooksError && (
                <p className="mt-3 text-sm text-red-500">{hooksError}</p>
              )}
            </CardContent>
          </Card>

          {/* Generated hooks */}
          {hooks.length > 0 && (
            <Card className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_8px_36px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)]">
              <CardContent className="p-0">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                  <div className="flex items-center gap-2">
                    <img className="h-4 w-4" src="/figmaAssets/svg-1.svg" alt="" aria-hidden="true" />
                    <span className="text-[13px] font-medium text-gray-900">Generated Hooks</span>
                  </div>
                  <span className="text-[11px] text-gray-400">{hooks.length} hooks</span>
                </div>

                {/* Hook rows */}
                <div className="flex flex-col divide-y divide-gray-50">
                  {hooks.map((hook, i) => {
                    const style = getTypeStyle(hook.type);
                    const isSelected = selectedIdx === i;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setSelectedIdx(i); setConcepts([]); setConceptsError(null); }}
                        className={`flex w-full flex-col gap-2 px-4 py-3 text-left transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:py-4 ${isSelected ? "bg-gray-50" : ""}`}
                      >
                        <Badge
                          className={`self-start shrink-0 h-auto rounded-full px-2.5 py-1 text-[11px] font-normal border-0 ${style.bg} ${style.color} hover:${style.bg} whitespace-nowrap`}
                        >
                          {hook.type}
                        </Badge>
                        <span className="flex-1 text-[14px] leading-[22px] text-gray-900">
                          {hook.title}
                        </span>
                        <button
                          type="button"
                          className="hidden sm:block ml-2 shrink-0 text-[11px] text-gray-400 hover:text-[#ff0000]"
                          onClick={(e) => {
                            e.stopPropagation();
                            void navigator.clipboard.writeText(hook.title);
                          }}
                        >
                          Copy
                        </button>
                      </button>
                    );
                  })}
                </div>

                {/* ── Thumbnail Concepts ── */}
                <div className="border-t border-gray-100">
                  <div className="flex items-center justify-between px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-2">
                      {/* image/frame icon */}
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[12px] font-medium text-gray-600">Text Thumbnail Concepts</span>
                      <span className="hidden sm:inline text-[11px] text-gray-400">— 3 visual ideas for the selected hook</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateConcepts}
                      disabled={conceptsLoading}
                      className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
                    >
                      {conceptsLoading ? (
                        <>
                          <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Generating…
                        </>
                      ) : (
                        <>
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Generate
                        </>
                      )}
                    </button>
                  </div>

                  {conceptsError && (
                    <p className="px-4 pb-3 text-sm text-red-500 sm:px-6">{conceptsError}</p>
                  )}

                  {concepts.length > 0 && (
                    <div className="flex flex-col gap-3 px-4 pb-5 sm:px-6">
                      {concepts.map((concept, i) => {
                        const accent = conceptAccents[i] ?? conceptAccents[0];
                        return (
                          <div
                            key={i}
                            className={`flex gap-3 rounded-xl border ${accent.border} ${accent.bg} p-4`}
                          >
                            <div className="flex flex-col items-center gap-1.5 pt-0.5">
                              <span className={`text-[11px] font-bold ${accent.num}`}>{i + 1}</span>
                              <div className={`h-full w-px ${accent.border} bg-current opacity-30`} />
                            </div>
                            <p className="flex-1 text-[13px] leading-[21px] text-gray-800">{concept}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer: Generate Metadata */}
                <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <p className="text-[12px] text-gray-400">
                    Ready to publish? Generate your video metadata.
                  </p>
                  <Button
                    type="button"
                    onClick={handleGenerateMetadata}
                    disabled={metaLoading}
                    className="h-[38px] w-full sm:w-auto rounded-xl bg-[#ff0000] px-4 text-[13px] font-normal text-white hover:bg-[#e60000] disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {metaLoading ? (
                      <>
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <img className="h-3.5 w-3.5" src="/figmaAssets/svg-3.svg" alt="" aria-hidden="true" />
                        Generate Metadata
                      </>
                    )}
                  </Button>
                </div>

                {metaError && (
                  <p className="px-6 pb-4 text-sm text-red-500">{metaError}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Video Metadata */}
          {metadata && (
            <Card className="overflow-hidden rounded-2xl border border-green-100/70 bg-white shadow-[0_8px_36px_rgba(34,197,94,0.10),0_2px_8px_rgba(0,0,0,0.06)]">
              <CardContent className="p-0">
                {/* Header */}
                <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-[13px] font-medium text-gray-900">Video Metadata</span>
                  <span className="text-[11px] text-gray-400">· Notion-style doc</span>
                </div>

                <div className="flex flex-col gap-0 divide-y divide-gray-50">
                  {/* Description */}
                  <div className="px-6 py-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[11px] font-medium tracking-[1.1px] text-gray-400 flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                        DESCRIPTION
                      </p>
                      <button
                        type="button"
                        className="text-[11px] text-gray-400 hover:text-[#ff0000] flex items-center gap-1"
                        onClick={() => void navigator.clipboard.writeText(metadata.description)}
                      >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Copy
                      </button>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-[13px] leading-[22px] text-gray-700 whitespace-pre-wrap">
                        {metadata.description}
                      </p>
                    </div>
                  </div>

                  {/* Hashtags */}
                  <div className="px-6 py-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[11px] font-medium tracking-[1.1px] text-gray-400 flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
                        HASHTAGS
                      </p>
                      <button
                        type="button"
                        className="text-[11px] text-gray-400 hover:text-[#ff0000] flex items-center gap-1"
                        onClick={() => void navigator.clipboard.writeText(metadata.hashtags.join(" "))}
                      >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Copy
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {metadata.hashtags.map((tag) => (
                        <Badge
                          key={tag}
                          className="h-auto rounded-full bg-[#fff0f0] px-3 py-1 text-[12px] font-normal text-[#ff0000] hover:bg-[#ffe0e0] border-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="px-6 py-5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] font-medium tracking-[1.1px] text-gray-400 flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                        TAGS
                      </p>
                      <button
                        type="button"
                        className="text-[11px] text-gray-400 hover:text-[#ff0000] flex items-center gap-1"
                        onClick={() => void navigator.clipboard.writeText(metadata.tags.join(", "))}
                      >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Copy
                      </button>
                    </div>
                    <p className="mb-3 text-[11px] text-gray-400">
                      Copy individual tags or paste all at once into YouTube Studio.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {metadata.tags.map((tag) => (
                        <Badge
                          key={tag}
                          className="h-auto rounded-full bg-gray-100 px-3 py-1 text-[12px] font-normal text-gray-600 hover:bg-gray-200 border-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-gray-100" />

                  {/* Footer: Copy All */}
                  <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p className="text-[12px] text-gray-400">All metadata ready to publish</p>
                    <Button
                      type="button"
                      onClick={handleCopyAll}
                      className="h-[38px] w-full sm:w-auto rounded-xl bg-gray-900 px-4 text-[13px] font-normal text-white hover:bg-gray-800 flex items-center justify-center gap-2"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      {copied ? "Copied!" : "Copy All"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </section>
  );
};
