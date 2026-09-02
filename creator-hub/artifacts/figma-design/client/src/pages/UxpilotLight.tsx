import { useState } from "react";
import { DashboardSidebarSection } from "./sections/DashboardSidebarSection";
import { ContentDashboardSection } from "./sections/ContentDashboardSection";
import { TrendsSection } from "./sections/TrendsSection";
import { TitleHookSection } from "./sections/TitleHookSection";

type Page = "Dashboard" | "Trends" | "Title Hook";

const navItems: { label: Page; icon: string }[] = [
  { label: "Dashboard", icon: "/figmaAssets/svg-8.svg" },
  { label: "Title Hook",icon: "/figmaAssets/svg-4.svg" },
  { label: "Trends",    icon: "/figmaAssets/svg-2.svg" },
];

export const UxpilotLight = (): React.JSX.Element => {
  const [activePage, setActivePage] = useState<Page>("Dashboard");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[linear-gradient(0deg,rgba(250,250,250,1)_0%,rgba(250,250,250,1)_100%),linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)]">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:block shrink-0 h-full">
        <DashboardSidebarSection activePage={activePage} onNavigate={setActivePage} />
      </aside>

      {/* Main content */}
      <main className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {activePage === "Dashboard" && <ContentDashboardSection />}
        {activePage === "Trends"    && <TrendsSection />}
        {activePage === "Title Hook"&& <TitleHookSection />}
      </main>

      {/* Mobile bottom nav — hidden on md+ */}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 flex border-t bg-white md:hidden"
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => {
          const isActive = activePage === item.label;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setActivePage(item.label)}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition-colors ${
                isActive ? "text-[#ff0000]" : "text-gray-400"
              }`}
            >
              <img
                className={`h-5 w-5 ${isActive ? "" : "opacity-40"}`}
                src={item.icon}
                alt=""
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
