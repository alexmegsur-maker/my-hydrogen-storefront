import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useLanguage } from "~/hooks/useLanguage";
import { interpolate, translations } from "~/utils/translations";
import type { SearchType } from "./types";

interface TabNoResultsProps {
  type: SearchType;
  searchTerm: string;
}

export function TabNoResults({ type, searchTerm }: TabNoResultsProps) {
  const lang = useLanguage();
  const t = translations[lang] ?? translations.ES;

  const typeLabels: Record<SearchType, string> = {
    products: t.search_typeProducts,
    articles: t.search_typeArticles,
    pages: t.search_typePages,
    collections: t.search_typeCollections,
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-secondary p-4">
        <MagnifyingGlassIcon className="size-8 text-body-subtle" />
      </div>
      <h3 className="text-lg font-medium">
        {interpolate(t.search_noResultsFound, { type: typeLabels[type] })}
      </h3>
      <p className="mt-1 text-body-subtle">
        {interpolate(t.search_noResultsMatching, {
          type: typeLabels[type],
          term: searchTerm,
        })}
      </p>
      <p className="mt-2 text-sm text-body-subtle">
        {t.search_tryDifferentKeywords}
      </p>
    </div>
  );
}
