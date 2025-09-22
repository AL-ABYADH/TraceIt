"use client";

import { forwardRef } from "react";

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  error?: string;
  type?: "text" | "email" | "password";
  disabled?: boolean;
  className?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, placeholder, error, type = "text", disabled, className = "", ...props }, ref) => {
    return (
      <div className="space-y-2 mt-2">
        {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-xl
            
            bg-input border border-border
            text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
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

InputField.displayName = "InputField";

export default InputField;
