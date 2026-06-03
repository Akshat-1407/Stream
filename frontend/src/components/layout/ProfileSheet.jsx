"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { ENDPOINT, api } from "../../lib/api";
import { useSelector, useDispatch } from "react-redux";
import { userLoggedOutDetails } from '@/redux/userSlice';
import { toast } from "sonner";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/movies" },
  { label: "Tv Shows", href: "/tv" },
  { label: "Watchlist", href: "/watchlist" },
  { label: "Jio+", href: "/jio+" },
];

export default function ProfileSheet() {

  const [open, setOpen] = useState(false)

  const router = useRouter();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)
  const user = useSelector((state) => state.user.user)

  const logoutHandler = async () => {
    try {
      const res = await api.get(ENDPOINT.logout);
      if (res.data.status === "success") {
        dispatch(userLoggedOutDetails());
        setOpen(false);
        router.push("/");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      toast.error(errorMessage)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>

      <SheetTrigger>
        {isLoggedIn ? (
          <div className="size-10 rounded-full bg-linear-to-br from-blue-800 to-cyan-800 flex items-center justify-center">
            <span className="text-white text-xl font-medium">{user?.name.at(0).toUpperCase()}</span>
          </div>
        ) : (
          <Image src="/profile.png" height={40} width={40} alt="avatar" className="rounded-full"></Image>
        )}
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md bg-[#0f0f0f] border-l border-white/10 p-0">

        <SheetTitle className="sr-only">Profile Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Navigation menu with profile options and links
        </SheetDescription>

        <div className="flex flex-col h-full overflow-y-auto">

          {/* Profile Section */}
          <div className="p-6 pt-15">
            <div className="bg-[#1a1a1a] rounded-2xl p-6 ">

              {isLoggedIn ? (

                <div className="flex flex-col items-center w-full">
                  <div className="size-25 rounded-full bg-linear-to-br from-blue-800 to-cyan-800 flex items-center justify-center mb-4">
                    <span className="text-white text-5xl font-medium">{user?.name.at(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-semibold mb-2 flex justify-center">
                      {user?.name}
                    </h3>
                    <Link 
                      href="/forgetPassword" 
                      className="text-md tracking-widest opacity-40 hover:underline hover:text-pink-400 hover:opacity-100 flex justify-center mb-4"
                      onClick={() => {
                       setOpen(false);
                      }} 
                    >
                      Reset Password
                    </Link>
                    <Button
                      onClick={logoutHandler}
                      className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white flex justify-center items-center font-semibold text-base h-10 px-12 rounded-full transition-colors cursor-pointer"
                    >
                      Logout
                    </Button>
                  </div>
                </div>

              ) : (

                <div className="flex flex-col items-center w-full">
                  <Image src="/profile.png" height={100} width={100} alt="avatar" className="rounded-full flex justify-center mb-4"></Image>
                  <div>
                    <h3 className="text-white text-xl font-semibold mb-8 flex justify-center">
                      Guest
                    </h3>
                    <Link
                      href="/login"
                      className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white flex justify-center items-center font-semibold text-base h-10 px-12 rounded-full transition-colors cursor-pointer"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      Login
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Subscribe */}
          <div className="px-3">
            <Link
              href="/subscription"
              className="w-full flex items-center justify-between py-4 text-white hover:bg-white/5 rounded-lg px-5 transition-colors"
              onClick={() => {
                setOpen(false);
              }}
            >
              <span className="text-base font-medium">Subscribe Now</span>
              <ChevronRight className="size-5 text-gray-400" />
            </Link>
          </div>

          {/* Navigation */}
          <div className="px-3 border-t border-white/10 mt-2 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="w-full flex items-center justify-between py-4 text-white hover:bg-white/5 rounded-lg px-5 transition-colors"
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
          <div className="px-3 border-t border-white/10 mt-2 pt-2">
            <button className="w-full flex items-center justify-between py-4 text-white hover:bg-white/5 rounded-lg px-5 transition-colors cursor-pointer">
              <span className="text-base font-medium">
                Help and Legal
              </span>
              <ChevronRight className="size-5 text-gray-400" />
            </button>
          </div>
        </div>

      </SheetContent >
    </Sheet >
  );
}