"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/movies" },
  { label: "Tv Shows", href: "/tv" },
  { label: "Watchlist", href: "/watchlist" },
  { label: "Jio+", href: "/jio+" },
];

export default function ProfileSheet() {

  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>

      <SheetTrigger>
        <div className="size-9 rounded-full bg-linear-to-br from-orange-400 to-amber-500 cursor-pointer flex items-center justify-center overflow-hidden">
          <span className="text-white text-xs font-medium">U</span>
        </div>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md bg-[#0f0f0f] border-l border-white/10 p-0">

        <SheetTitle className="sr-only">Profile Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Navigation menu with profile options and links
        </SheetDescription>

        <div className="flex flex-col h-full overflow-y-auto">

          {/* Profile Section */}
          <div className="p-6 pt-12">
            <div className="bg-[#1a1a1a] rounded-2xl p-6 flex flex-col items-center">
              <div className="size-24 rounded-full bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-medium">U</span>
              </div>
              <h3 className="text-white text-xl font-semibold mb-4">
                Guest
              </h3>
              <Link
                href="/login"
                className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white flex items-center font-semibold text-base h-10 px-8 rounded-full transition-colors cursor-pointer"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Login
              </Link>
            </div>
          </div>

          {/* Subscribe */}
          <div className="px-6">
            <Link
              href="/subscription"
              className="w-full flex items-center justify-between py-4 text-white hover:bg-white/5 rounded-lg px-2 transition-colors"
              onClick={() => {
                setOpen(false);
              }}
            >
              <span className="text-base font-medium">Subscribe Now</span>
              <ChevronRight className="size-5 text-gray-400" />
            </Link>
          </div>

          {/* Navigation */}
          <div className="px-6 border-t border-white/10 mt-2 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="w-full flex items-center justify-between py-4 text-white hover:bg-white/5 rounded-lg px-3 transition-colors"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <span className="text-base font-medium">
                  {item.label}
                </span>
                <ExternalLink className="size-5 text-gray-400" />
              </Link>
            ))}
          </div>

          {/* Help */}
          <div className="px-6 border-t border-white/10 mt-2 pt-2">
            <button className="w-full flex items-center justify-between py-4 text-white hover:bg-white/5 rounded-lg px-2 transition-colors cursor-pointer">
              <span className="text-base font-medium">
                Help and Legal
              </span>
              <ChevronRight className="size-5 text-gray-400" />
            </button>
          </div>
        </div>

      </SheetContent>
    </Sheet>
  );
}