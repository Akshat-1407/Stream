export function Loader() {

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="relative">

        {/* Background Glow */}
        <div className="absolute inset-0 scale-150 bg-linear-to-r from-red-500/20 to-pink-500/20 blur-3xl" />

        {/* Rotating Gradient Ring */}
        <div className="relative h-28 w-28 animate-spin rounded-full bg-linear-to-r from-red-500 via-pink-500 to-red-500 p-0.75">

          {/* Inner Circle */}
          <div className="flex h-full w-full items-center justify-center rounded-full bg-black">

            {/* Pulsing Circle */}
            <div className="absolute h-14 w-14 rounded-full bg-linear-to-r from-red-500 to-pink-500 opacity-30 animate-ping" />

            {/* Logo */}
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-pink-500 shadow-[0_0_40px_rgba(236,72,153,.6)]">
              <svg
                className="h-6 w-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>

          </div>
        </div>

        <p className="mt-8 text-center text-xs tracking-[0.5em] text-zinc-500">
          LOADING
        </p>
      </div>
    </div>
  );
}