import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Radio } from 'lucide-react';

export function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden select-none bg-[#08080a]">
      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-105 w-105 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-600/[0.07] blur-[130px]" />

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-70 w-70 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-[90px]"
      />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '45px 45px',
        }}
      />

      {/* =========================================================
          LOADER CORE
      ========================================================== */}

      <div className="relative flex h-45 w-45 items-center justify-center">
        {/* Outer glow */}
        <motion.div
          animate={{
            scale: [0.95, 1.05, 0.95],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-5 rounded-full border border-rose-500/20 shadow-[0_0_80px_rgba(244,63,94,0.12)]"
        />

        {/* Outer metallic bezel */}
        <div className="absolute inset-0 rounded-full border border-zinc-700/80 bg-linear-to-br from-zinc-800/30 via-transparent to-black/50 shadow-[inset_0_0_25px_rgba(0,0,0,0.9),0_0_40px_rgba(0,0,0,0.6)]" />

        {/* Outer thin ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-2 rounded-full border border-dashed border-zinc-600/50"
        />

        {/* Tech tick ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-4 rounded-full"
          style={{
            background: `
              repeating-conic-gradient(
                from 0deg,
                rgba(244,63,94,0.7) 0deg 1deg,
                transparent 1deg 12deg
              )
            `,
            maskImage:
              'radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 2px))',
            WebkitMaskImage:
              'radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 2px))',
          }}
        />

        {/* Main rotating aperture */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-7 rounded-full border-[5px] border-zinc-900 border-t-rose-500 border-r-rose-500/30 border-b-pink-500 shadow-[0_0_25px_rgba(244,63,94,0.25)]"
        />

        {/* Counter rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-10 rounded-full border border-rose-400/20 border-l-rose-400/70 border-r-transparent"
        />

        {/* Scanner sweep */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-13rflow-hidden rounded-full"
        >
          <div className="absolute left-1/2 top-0 h-1/2 w-0.5 origin-bottom -translate-x-1/2 bg-linear-to-b from-rose-400/70 to-transparent blur-[1px]" />
        </motion.div>

        {/* Inner lens */}
        <div className="absolute inset-14.5 flex items-center justify-center rounded-full border border-zinc-700/70 bg-linear-to-brrom-zinc-900 via-[#0b0b0e] to-black shadow-[inset_0_0_25px_rgba(0,0,0,0.95)]">
          {/* Inner glass */}
          <motion.div
            animate={{
              scale: [0.96, 1.04, 0.96],
              opacity: [0.65, 1, 0.65],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-3 rounded-full border border-rose-500/30 shadow-[0_0_25px_rgba(244,63,94,0.2)]"
          />

          {/* Core rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-6 rounded-full border border-dashed border-rose-500/30"
          />

          {/* Center core */}
          <motion.div
            animate={{
              scale: [0.92, 1.05, 0.92],
              boxShadow: [
                '0 0 20px rgba(225,29,72,0.4)',
                '0 0 45px rgba(225,29,72,0.8)',
                '0 0 20px rgba(225,29,72,0.4)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative flex h-16 w-16 items-center justify-center rounded-full border border-rose-300/30 bg-linear-to-tr from-rose-700 via-rose-500 to-pink-400"
          >
            {/* Core highlight */}
            <div className="absolute inset-0.75 rounded-full bg-linear-to-br from-white/20 via-transparent to-black/20" />

            <Activity className="relative z-10 h-7 w-7 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
          </motion.div>
        </div>

        {/* Corner indicators */}
        <div className="absolute left-8 top-19.5 h-1 w-1 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)]" />
        <div className="absolute right-8 top-19.5 h-1 w-1 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)]" />
        <div className="absolute bottom-19.5 left-8 h-1 w-1 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)]" />
        <div className="absolute bottom-19.5 right-8 h-1 w-1 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)]" />
      </div>

      {/* =========================================================
          STATUS
      ========================================================== */}

      <div className="relative mt-7 flex flex-col items-center">
        {/* Status pill */}
        <div className="flex items-center gap-3 rounded-full border border-zinc-800/80 bg-zinc-950/60 px-4 py-2 shadow-[0_0_25px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <motion.div
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
            }}
            className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)]"
          />

          <span className="font-mono text-[10px] tracking-[0.35em] text-zinc-300">
            AUDIOVISUAL_SYNCING
          </span>

          <Radio className="h-3 w-3 text-rose-500" />
        </div>

        {/* Equalizer */}
        <div className="mt-4 flex h-5 items-center gap-0.75">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              animate={{
                height: ['3px', `${8 + ((i * 7) % 14)}px`, '3px'],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 0.7 + i * 0.08,
                repeat: Infinity,
                delay: i * 0.09,
                ease: 'easeInOut',
              }}
              className="w-0.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.5)]"
            />
          ))}
        </div>

        {/* Secondary status */}
        <motion.span
          animate={{ opacity: [0.35, 0.7, 0.35] }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="mt-3 font-mono text-[8px] tracking-[0.3em] text-zinc-600"
        >
          INITIALIZING MEDIA ENGINE
        </motion.span>
      </div>

      {/* Bottom subtle scan line */}
      <motion.div
        animate={{ y: ['-100vh', '100vh'] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="pointer-events-none absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-rose-500/10 to-transparent"
      />
    </div>
  );
}