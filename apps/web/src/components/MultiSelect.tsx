"use client";

import { forwardRef, useState, useEffect } from "react";
import clsx from "clsx";

interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  label?: string;
  placeholder?: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  ({ label, placeholder, options, value, onChange, disabled, error, className = "" }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const toggleValue = (val: string) => {
      if (value.includes(val)) {
        onChange(value.filter((v) => v !== val));
      } else {
        onChange([...value, val]);
      }
    };

    // Filter options based on search
    const filteredOptions = options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase()),
    );

    return (
      <div ref={ref} className={`space-y-2 mt-2 relative ${className}`}>
        {label && <label className="block text-sm font-medium text-foreground">{label}</label>}

        <div
          className={clsx(
            "border rounded-xl bg-input text-foreground w-full cursor-pointer",
            "focus-within:ring-2 focus-within:ring-primary",
            error ? "border-destructive focus-within:ring-destructive" : "border-border",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <div
            className="px-3 py-2 flex justify-between items-center"
            onClick={() => !disabled && setIsOpen(!isOpen)}
          >
            <span>
              {value.length === 0 ? placeholder || "Select…" : `${value.length} selected`}
            </span>
            <svg
              className={clsx("w-5 h-5 transition-transform", isOpen && "rotate-180")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {isOpen && (
            <div className="absolute z-10 mt-1 w-full max-h-48 overflow-auto border rounded-xl bg-surface shadow-lg">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 border-b outline-none"
              />
              {filteredOptions.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">No options found</div>
              ) : (
                filteredOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={clsx(
                      "flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-surface/5",
                      opt.disabled && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(opt.value)}
                      disabled={opt.disabled || disabled}
                      onChange={() => toggleValue(opt.value)}
                      className="h-4 w-4 border-gray-300 rounded text-green-600"
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  },
);

MultiSelect.displayName = "MultiSelect";

export default MultiSelect;
