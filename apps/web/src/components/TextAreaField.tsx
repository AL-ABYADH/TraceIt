"use client";

import { forwardRef } from "react";

interface TextareaFieldProps {
  label?: string;
  placeholder?: string;
  error?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
}

const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, placeholder, error, rows = 4, disabled, className = "", ...props }, ref) => {
    return (
      <div className="space-y-2 mt-4">
        {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
        <textarea
          ref={ref}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-xl
            bg-input border border-border
            text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors resize-none
            ${error ? "border-destructive focus:ring-destructive focus:border-destructive" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  },
);

TextareaField.displayName = "TextareaField";

export default TextareaField;
