import { Crown, Users } from "lucide-react";

export default function WatchRoomInfo({ roomId, movieName, description, hostName, actions }) {
    return (
        <div className="px-6 py-6 space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-neutral-800 pb-5">
                <div>
                    <span className="text-xs font-semibold text-rose-500 tracking-wider uppercase bg-rose-500/10 px-2.5 py-1 rounded-md">
                        Watch Room
                    </span>
                    <h1 className="text-2xl md:text-3xl font-black text-white mt-2">
                        {movieName}
                    </h1>
                </div>
                {actions}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-white">About the Watch Party</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {description || "Welcome to the Watch Room. Stream premium content synchronized in real-time."}
                    </p>
                </div>
                <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-xl p-4 space-y-4">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Users className="w-4 h-4 text-rose-500" />
                        <span className="font-semibold">Room Code:</span>
                        <span className="font-mono text-neutral-400 bg-black/40 px-2 py-0.5 rounded border border-neutral-800">{roomId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Crown className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold">Host:</span>
                        <span className="text-neutral-400">{hostName || "Premium Host"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
