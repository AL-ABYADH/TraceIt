"use client";

import Image from "next/image";
import Link from "next/link";
import { FolderIcon } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full bg-background text-foregroundbg-surface border-b border-border">
      <div className="mx-auto flex items-center justify-between px-6 h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <FolderIcon className="w-6 h-6 text-primary group-hover:text-primary-hover transition-colors" />
          <span className="text-xl font-semibold text-foreground tracking-tight">TraceIt</span>
        </Link>

        <button
          type="button"
          className="w-10 h-10 rounded-full overflow-hidden border border-border hover:ring-2 hover:ring-ring focus:outline-none focus:ring-2 focus:ring-ring transition"
        >
          <Image
            src={""}
            alt="Profile"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}
