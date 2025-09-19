import React from "react";

export const metadata = { title: "Public" };

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
