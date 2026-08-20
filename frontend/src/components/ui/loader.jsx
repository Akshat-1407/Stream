import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export function Loader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0d0d0f] overflow-hidden select-none z-50">
      {/* Background Red Ambient Glow */}
      <div className="absolute w-45 h-45 bg-rose-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative flex items-center justify-center w-45 h-45">
        {/* Outer Metallic Bezel */}
        <div className="absolute inset-0 rounded-full border-2 border-zinc-800 shadow-[inset_0_0_15px_rgba(0,0,0,0.9)]" />

        {/* Rotating Outer Tech Marks */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border border-dashed border-rose-500/30"
        />

        {/* Counter-Rotating Aperture Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-6 rounded-full border-[6px] border-zinc-900 border-t-rose-500 border-b-pink-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]"
        />

        {/* Inner Dark Lens Container */}
        <div className="absolute inset-12 rounded-full bg-linear-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800 flex items-center justify-center">
          {/* Inner Glow Ring */}
          <motion.div
            animate={{ scale: [0.98, 1.03, 0.98] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-32 h-32 rounded-full border border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.3)] flex items-center justify-center"
          >
            {/* Center Core with Red/Rose Gradient */}
            <div className="w-16 h-16 rounded-full bg-linear-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-[0_0_30px_rgba(225,29,72,0.8)]">
              <Activity className="w-8 h-8 text-white animate-pulse" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-8 flex items-center gap-3">
        <span className="text-xs font-mono tracking-[0.4em] text-zinc-300">
          AUDIOVISUAL_SYNCING
        </span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ height: ['4px', '16px', '4px'] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              className="w-1 bg-rose-500 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}