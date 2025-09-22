"use client";

import { forwardRef } from "react";
import { ChevronDownIcon } from "lucide-react";

interface SelectFieldProps {
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  defaultValue?: string;
  children: React.ReactNode;
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    { label, placeholder, error, disabled, className = "", defaultValue, children, ...props },
    ref,
  ) => {
    return (
      <div className="space-y-2 my-5">
        {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            defaultValue={defaultValue} // ✅ Pass the default value
            className={`
              w-full px-4 py-3 rounded-xl appearance-none
              bg-input border border-border
              text-foreground
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
