"use client";

import {useMemo, type ReactNode} from "react";
import {useGalleryBreakpointColumns} from "@/lib/projectStory/useGalleryBreakpointColumns";
import {MORE_PREVIEW_COLS} from "@/lib/more/preview";
import {buildBestPreviewLayout} from "@/lib/more/previewLayout";
import {usePreviewRandomSeed} from "@/lib/more/usePreviewRandomSeed";

const previewGapClass = "gap-x-2 sm:gap-x-3";
const previewStackClass = "gap-2 sm:gap-3";
export const previewPlaceholderClass = "min-h-48 sm:min-h-56 md:min-h-64";

export function useMorePreviewLayout<T>(
  items: readonly T[],
  scopeKey: string,
  isPortrait: (item: T) => boolean,
) {
  const seed = usePreviewRandomSeed(scopeKey);
  const visibleColumns = useGalleryBreakpointColumns(MORE_PREVIEW_COLS);

  const layout = useMemo(() => {
    if (!seed) return null;
    return buildBestPreviewLayout(items, seed, visibleColumns, isPortrait);
  }, [items, seed, visibleColumns, isPortrait]);

  return {
    ready: seed != null && layout != null,
    picked: layout?.picked ?? [],
    columns: layout?.columns ?? [],
    visibleColumns,
  };
}

export function MoreBlockPreviewLayout<T>({
  ready,
  columns,
  renderItem,
  getKey,
}: {
  ready: boolean;
  columns: T[][];
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T, index: number) => string;
}) {
  if (!ready) {
    return <div className={previewPlaceholderClass} aria-hidden />;
  }

  if (columns.length === 0) return null;

  return (
    <div className={`flex items-start ${previewGapClass}`}>
      {columns.map((column, colIndex) => (
        <div key={colIndex} className={`flex min-w-0 flex-1 flex-col ${previewStackClass}`}>
          {column.map((item, rowIndex) => {
            const index = colIndex * 2 + rowIndex;
            return <div key={getKey(item, index)}>{renderItem(item, index)}</div>;
          })}
        </div>
      ))}
    </div>
  );
}

export function MoreBlockPreviewColumns<T>({
  items,
  scopeKey,
  isPortrait,
  renderItem,
  getKey,
}: {
  items: readonly T[];
  scopeKey: string;
  isPortrait: (item: T) => boolean;
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T, index: number) => string;
}) {
  const layout = useMorePreviewLayout(items, scopeKey, isPortrait);

  return (
    <MoreBlockPreviewLayout
      ready={layout.ready}
      columns={layout.columns}
      renderItem={renderItem}
      getKey={getKey}
    />
  );
}
