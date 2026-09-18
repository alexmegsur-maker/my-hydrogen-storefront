import { useLanguage } from "~/hooks/useLanguage";
import { cn } from "~/utils/cn";
import { translations } from "~/utils/translations";
import type { SearchCounts, SearchType } from "./types";

interface SearchTabsProps {
  counts: SearchCounts;
  activeTab: SearchType;
  onTabChange: (type: SearchType) => void;
}

export function SearchTabs({
  counts,
  activeTab,
  onTabChange,
}: SearchTabsProps) {
  const lang = useLanguage();
  const t = translations[lang] ?? translations.ES;

  const tabs: { type: SearchType; label: string }[] = [
    { type: "products", label: t.search_tabProducts },
    { type: "articles", label: t.search_tabArticles },
    { type: "pages", label: t.search_tabPages },
    { type: "collections", label: t.search_tabCollections },
  ];

  return (
    <div className="border-b border-line-subtle">
      <div className="flex gap-8">
        {tabs.map(({ type, label }) => (
          <button
            key={type}
            type="button"
            onClick={() => onTabChange(type)}
            className={cn(
              "relative py-3 font-medium transition-colors cursor-pointer",
              activeTab === type
                ? "text-foreground"
                : "text-body-subtle hover:text-foreground",
            )}
          >
            <span>{label}</span>
            <span
              className={cn(
                "ml-1.5",
                activeTab === type ? "text-foreground" : "text-body-subtle",
              )}
            >
              ({counts[type]})
            </span>
            {activeTab === type && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
