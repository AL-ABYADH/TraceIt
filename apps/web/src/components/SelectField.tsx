"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import type { ReactNode } from "react";
import { ChevronDownIcon } from "lucide-react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, placeholder, error, className = "", children, ...props }, ref) => {
    return (
      <div className="space-y-2 my-5">
        {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full pr-10 px-4 py-3 rounded-xl appearance-none
              bg-input border border-border
              text-foreground truncate text-ellipsis
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
              ${error ? "border-destructive focus:ring-destructive focus:border-destructive" : ""}
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-muted-foreground">
                {placeholder}
              </option>
            )}
            {children}
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  },
);

SelectField.displayName = "SelectField";

export default SelectField;
