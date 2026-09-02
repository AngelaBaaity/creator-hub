import { useState } from "react";
import { Button } from "@/components/ui/button";

type Page = "Dashboard" | "Trends" | "Title Hook";

interface Props {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navigationItems: { label: Page; icon: string }[] = [
  { label: "Dashboard", icon: "/figmaAssets/svg-8.svg" },
  { label: "Title Hook",icon: "/figmaAssets/svg-4.svg" },
  { label: "Trends",    icon: "/figmaAssets/svg-2.svg" },
];

export const DashboardSidebarSection = ({ activePage, onNavigate }: Props): React.JSX.Element => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`flex h-full self-stretch flex-col border-r bg-white transition-[width] duration-200 ${
        isCollapsed ? "w-[72px]" : "w-[220px]"
      }`}
      aria-label="CreatorHub AI navigation"
    >
      <header className="flex min-h-[69px] items-center justify-between border-b">
        <div
          className={`flex min-w-0 items-center gap-3 ${
            isCollapsed ? "px-[22px]" : "px-4"
          } py-5`}
        >
          {/* CreatorHub logo: cursive C in red square */}
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[#ff0000] shadow-[0_2px_8px_rgba(255,0,0,0.45)]">
            <span
              style={{ fontFamily: "'Dancing Script', cursive", fontSize: "18px", lineHeight: 1, color: "#fff", fontWeight: 700 }}
            >
              C
            </span>
          </div>
          {!isCollapsed && (
            <p className="min-w-0 whitespace-nowrap [font-family:'Inter',Helvetica] text-[13px] font-bold leading-[19.5px] tracking-[-0.32px]">
              <span className="text-gray-900">CreatorHub</span>
              <span className="text-[#ff0000]"> AI</span>
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mr-[-11px] h-6 w-6 shrink-0 rounded-full p-0"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setIsCollapsed((c) => !c)}
        >
          <img
            className="h-6 w-6"
            alt=""
            aria-hidden="true"
            src="/figmaAssets/button.svg"
          />
        </Button>
      </header>

      <nav
        className="flex flex-1 flex-col gap-1 px-2 pt-4"
        aria-label="Main navigation"
      >
        {navigationItems.map((item) => {
          const isActive = activePage === item.label;
          return (
            <Button
              key={item.label}
              type="button"
              variant="ghost"
              className={`h-auto w-full justify-start gap-3 rounded-none px-3 py-2.5 text-left [font-family:'Inter',Helvetica] text-sm font-normal leading-5 tracking-[0] hover:bg-[#fff0f0] hover:text-[#ff0000] ${
                isActive ? "bg-[#fff0f0] text-[#ff0000]" : "text-gray-500"
              } ${isCollapsed ? "justify-center px-0" : ""}`}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onNavigate(item.label)}
            >
              <img
                className="h-[18px] w-[18px] shrink-0"
                alt=""
                aria-hidden="true"
                src={item.icon}
                style={{ filter: "invert(15%) sepia(100%) saturate(6000%) hue-rotate(0deg) brightness(110%) contrast(110%)" }}
              />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      <footer
        className={`flex items-center gap-3 border-t p-3 ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        {!isCollapsed && (
          <div className="flex flex-col [font-family:'Inter',Helvetica]">
            <span className="whitespace-nowrap text-xs font-normal leading-[18px] tracking-[0] text-gray-900">
              Angela Baaity
            </span>
            <span className="whitespace-nowrap text-[11px] font-normal leading-[16.5px] tracking-[0] text-gray-500">
              Creator
            </span>
          </div>
        )}
      </footer>
    </aside>
  );
};
