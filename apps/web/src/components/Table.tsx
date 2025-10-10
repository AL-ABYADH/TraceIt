"use client";

import { ReactNode } from "react";

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
}

export default function DataTable<T>({
  columns,
  data,
  className = "",
  onRowClick,
}: DataTableProps<T>) {
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
            data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(item, rowIndex)}
                className={`border-b border-border/50 transition-colors ${
                  onRowClick ? "hover:bg-card/40 cursor-pointer" : "hover:bg-card/30"
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
