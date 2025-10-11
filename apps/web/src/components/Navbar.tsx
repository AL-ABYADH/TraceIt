"use client";

import Image from "next/image";
import Link from "next/link";
import { FolderIcon, LogOut } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { tokenService } from "@/modules/core/auth/services/token-service";
import { useState } from "react";

export default function Navbar() {
  const { user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    tokenService.clear();
  };

  return (
    <header className="w-full bg-background text-foregroundbg-surface border-b border-border">
      <div className="mx-auto flex items-center justify-between px-6 h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <FolderIcon className="w-6 h-6 text-primary group-hover:text-primary-hover transition-colors" />
          <span className="text-xl font-semibold text-foreground tracking-tight">TraceIt</span>
        </Link>

        <div className="relative">
          <button
            type="button"
            className="w-10 h-10 rounded-full overflow-hidden border border-border hover:ring-2 hover:ring-ring focus:outline-none focus:ring-2 focus:ring-ring transition"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Image
              src={"/profile-placeholder.png"}
              alt="Profile"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-foreground">{user?.displayName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <div className="border-t border-border my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
              >
                <div className="flex items-center">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
