"use client"

import Link from "next/link"
import { Search, Crown } from "lucide-react"
import { usePathname } from "next/navigation";
import ProfileSheet from "./ProfileSheet";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", key:"", href: "/" },
  { label: "Movies", key: "movies", href: "/movies",},
  { label: "Tv Shows", key: "tv", href: "/tv" },
  { label: "Watchlist", key: "watchlist", href: "/watchlist" },
  { label: "Jio+", key: "jio+", href: "/jio+" },
]

export function Header() {

  const path = usePathname();
  const activeTabKey = path.split("/")[1];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0f0f0f] border-b border-gray-700">
      <div className="flex h-18 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Left Section: Logo + Premium + Nav */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            {/* Logo placeholder - replace with actual logo */}
            <div className="size-9 rounded-lg bg-linear-to-br from-pink-500 to-pink-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">JC</span>
            </div>
            <span className="text-pink-500 font-bold text-lg">JioCinema</span>
          </Link>

          {/* Go Premium Button */}
          <Link href="/subscription" className="hidden md:flex items-center bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold text-sm h-8 px-3 rounded-full gap-1.5 transition-colors">
            <Crown className="size-4" />
            Go Premium
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`px-3 py-2 font-medium text-[#b6b8b8] hover:text-white ${activeTabKey === item.key
                ? "border-b-2 border-pink-500 text-white"
                : ""
                } `}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Section: Search + Avatar */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="hidden lg:flex items-center bg-[#1a1a1a] border border-white/10 rounded-full px-3 py-1.5 gap-2 w-40 lg:w-52">
            <Search className="size-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-gray-500 w-full"
            />
          </div>

          <ProfileSheet/>

        </div>
      </div>
    </header>
  )
}
