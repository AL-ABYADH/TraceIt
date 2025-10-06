"use client";

import type { ReactNode } from "react";

interface ChipProps {
  label?: string;
  value: string | ReactNode;
  color?: "slate" | "indigo" | "emerald" | "rose" | "amber";
  onClick?: () => void;
  className?: string;
}

const colorMap: Record<NonNullable<ChipProps["color"]>, string> = {
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-200",
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-800/40 dark:text-indigo-200",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-800/40 dark:text-emerald-200",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-800/40 dark:text-rose-200",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-800/40 dark:text-amber-100",
};

export default function Chip({
  label,
  value,
  color = "slate",
  onClick,
  className = "",
}: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
        colorMap[color]
      } ${onClick ? "cursor-pointer hover:opacity-90" : ""} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      {label && <span className="opacity-80">{label}:</span>}
      <span className="truncate max-w-[14rem]">{value}</span>
    </span>
  );
}
