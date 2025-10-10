"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

export interface Column<T> {
  key: keyof T;
  title: string;
  width?: string;
  render?: (value: any, item: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  onRowClick?: (item: T, index: number) => void;
  highlightedId?: string | null;
}

export default function DataTable<T extends { id?: string }>({
  columns,
  data,
  className = "",
  onRowClick,
  highlightedId,
}: DataTableProps<T>) {
  const [activeHighlight, setActiveHighlight] = useState<string | null>(highlightedId ?? null);
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  // Handle highlight from props and remove after 5 seconds
  useEffect(() => {
    if (highlightedId) {
      setActiveHighlight(highlightedId);

      // Scroll the highlighted row into view
      const row = rowRefs.current[highlightedId];
      if (row) {
        row.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      const timeout = setTimeout(() => setActiveHighlight(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [highlightedId]);

  const handleRowClick = (item: T, index: number) => {
    setActiveHighlight(null); // Remove highlight immediately
    onRowClick?.(item, index);
  };

  return (
    <div className={`rounded-lg border border-border overflow-auto ${className}`}>
      <table className="w-full overflow-auto">
        {/* Header */}
        <thead>
          <tr className="border-b border-border bg-surface">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-4 py-3 text-left text-sm font-medium text-foreground"
                style={column.width ? { width: column.width } : undefined}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                No data available
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => {
              const isHighlighted = item.id === activeHighlight;

              return (
                <tr
                  key={rowIndex}
                  ref={(el) => {
                    if (item.id) rowRefs.current[item.id] = el;
                  }}
                  onClick={() => handleRowClick(item, rowIndex)}
                  style={isHighlighted ? { backgroundColor: "rgba(107,114,128,0.1)" } : undefined}
                  className={`border-b border-border/50 transition-colors duration-300 ${
                    !isHighlighted
                      ? onRowClick
                        ? "hover:bg-card/40 cursor-pointer"
                        : "hover:bg-card/30"
                      : ""
                  }`}
                >
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-4 py-3 text-sm text-foreground">
                      {column.render
                        ? column.render(item[column.key], item, rowIndex)
                        : String(item[column.key] ?? "")}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
