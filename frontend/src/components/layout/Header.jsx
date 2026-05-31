"use client"

import Link from "next/link"
import Image from "next/image";
import { Input } from "@base-ui/react";
import { Search, Crown } from "lucide-react"
import { usePathname } from "next/navigation";
import ProfileSheet from "./ProfileSheet";


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
        <div className="flex items-center gap-4 lg:gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/app_logo.png" width={35} height={35} alt="logo"/>
            <span className="text-pink-500 font-bold text-xl"> Stream</span>
          </Link>

          {/* Go Premium Button */}
          <Link
            href="/subscription"
            className="ml-4 mr-4 md:px-4 px-4 py-1 font-medium rounded-3xl flex items-center gap-2 text-[#c1a362] border-[#c1a362] border text-sm md:text-base"
          >
            <Crown className="size-4"></Crown>
            <span>
              {/* {userData?.user?.isPremium ? "" : "Go "}Premium */}
              Go Premium
            </span>
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
            <Input
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
