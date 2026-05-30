"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

// --- Data Structures ---
const footerLinks = {
  browse: [
    { label: "Home", href: "/" },
    { label: "Movies", href: "/movies" },
    { label: "TV Shows", href: "/tv" },
    { label: "Watchlist", href: "/watchlist" },
    { label: "Premium", href: "/subscription" },
  ],
  help: [
    { label: "Help Center", href: "/" },
    { label: "Account", href: "/" },
    { label: "Contact Us", href: "/" },
    { label: "FAQs", href: "/" },
  ],
  legal: [
    { label: "Terms of Use", href: "/" },
    { label: "Privacy Policy", href: "/" },
    { label: "Cookie Policy", href: "/" },
    { label: "Content Grievance", href: "/" },
  ],
}

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { label: "Twitter", href: "https://twitter.com", icon: TwitterIcon },
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "YouTube", href: "https://youtube.com", icon: YouTubeIcon },
]

// --- Sub-Components ---

/**
 * Collapsible section for mobile, standard list for desktop
 */
function FooterSection({ title, links }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-white/5 md:border-none">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 md:py-0 md:mb-4 group focus:outline-none"
      >
        <h3 className="text-white font-bold text-sm uppercase tracking-widest">{title}</h3>
        <ChevronDown 
          className={`size-5 text-gray-500 transition-transform duration-300 md:hidden ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      <nav 
        className={`flex flex-col gap-3 overflow-hidden transition-all duration-300 md:max-h-none ${
          isOpen ? 'max-h-75 pb-6' : 'max-h-0 md:h-auto'
        }`}
      >
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-gray-400 hover:text-pink-500 text-[15px] md:text-sm transition-colors py-1 md:py-0"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

/**
 * App Store/Play Store Buttons
 */
function AppButton({ type }) {
  const isApple = type === 'apple';
  const Icon = isApple ? AppleIcon : PlayStoreIcon;
  
  return (
    <a
      href="#"
      className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-xl px-5 py-3 transition-all border border-white/5 w-full sm:w-auto md:w-full"
    >
      <Icon className="size-6 text-white shrink-0" />
      <div className="flex flex-col">
        <span className="text-[10px] text-gray-500 uppercase font-bold leading-none mb-1">
          {isApple ? 'Download on the' : 'Get it on'}
        </span>
        <span className="text-white text-sm font-bold leading-none">
          {isApple ? 'App Store' : 'Google Play'}
        </span>
      </div>
    </a>
  )
}

// --- Main Component ---

export function Footer() {
  return (
    <footer className="w-full bg-[#0f0f0f] border-t border-white/5 font-sans relative">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-12">
        
        <div className="flex flex-col md:flex-row flex-wrap lg:flex-nowrap gap-12 lg:gap-20">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-6 md:w-75 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="size-10 rounded-lg bg-linear-to-br from-pink-500 to-pink-600 flex items-center justify-center transition-transform group-hover:scale-110">
                <span className="text-white font-bold text-sm">JC</span>
              </div>
              <span className="text-white font-bold text-2xl tracking-tighter group-hover:text-pink-500 transition-colors">
                JioCinema
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Stream the latest movies, TV shows, sports, and exclusive originals. 
              High-quality entertainment, available on all your favorite devices.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="size-10 rounded-full bg-white/5 hover:bg-pink-500/10 flex items-center justify-center text-gray-400 hover:text-pink-500 transition-all border border-white/5"
                  >
                    <Icon className="size-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Nav Links Grid */}
          <div className="grow grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8 lg:gap-12">
            <FooterSection title="Browse" links={footerLinks.browse} />
            <FooterSection title="Help" links={footerLinks.help} />
            <FooterSection title="Legal" links={footerLinks.legal} />
          </div>

          {/* Downloads */}
          <div className="flex flex-col gap-6 md:w-full lg:w-60">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest">Download App</h3>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <AppButton type="apple" />
              <AppButton type="google" />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-gray-500 text-xs text-center md:text-left">
              &copy; {new Date().getFullYear()} JioCinema. All rights reserved.
            </p>
            <p className="text-gray-600 text-[10px] hidden md:block">
              Reliance Storage Limited © 2026
            </p>
          </div>
 
        </div>
      </div>
    </footer>
  )
}

// --- Icons (Same as before but cleaned up) ---

function FacebookIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function TwitterIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function InstagramIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function YouTubeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function AppleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function PlayStoreIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
    </svg>
  )
}