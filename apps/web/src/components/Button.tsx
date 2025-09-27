"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  disabled = false,
  type = "button",
  ...props
}: ButtonProps) {
  const baseClasses =
    "font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm hover:shadow-md",
    secondary: "bg-secondary text-secondary-foreground hover:bg-accent border border-border",
    ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm font-medium",
    lg: "px-8 py-4 text-base font-medium",
  };

  const classes = `${className} ${baseClasses} ${variants[variant]} ${sizes[size]} `;

  return (
    <button className={classes} onClick={onClick} disabled={disabled} type={type} {...props}>
      {children}
    </button>
  );
}
