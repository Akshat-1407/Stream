import React from "react";

function OfferCard({ title, features, price, originalPrice, discountLabel, duration, isActive, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`relative p-6 md:p-8 rounded-xl cursor-pointer transition-all duration-300 group overflow-hidden ${
                isActive
                    ? "bg-linear-to-br from-pink-950 to-slate-900 border-2 border-pink-500 shadow-lg shadow-pink-500/20"
                    : "bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-slate-600 hover:shadow-lg hover:shadow-slate-700/20"
            }`}
        >
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-linear-to-br from-pink-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Special Offer Badge */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-linear-to-r from-pink-600 to-pink-500 text-white text-xs uppercase font-bold rounded-full shadow-lg">
                {discountLabel}
            </div>

            <div className="relative flex flex-col h-full justify-between space-y-6">
                {/* Title and Duration */}
                <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white">{title}</h3>
                    <div className="inline-block px-3 py-1 bg-slate-700/50 text-gray-300 text-xs font-semibold rounded-full">
                        {duration}
                    </div>
                </div>

                {/* Features List */}
                <div className="space-y-2 grow">
                    <ul className="space-y-2">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm text-gray-300">
                                <span className="text-pink-400 font-bold text-lg leading-none mt-0.5">•</span>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Price Section */}
                <div className="space-y-3 pt-4 border-t border-slate-700/50">
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white">₹{price}</span>
                        <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                        Save {Math.round(((originalPrice - price) / originalPrice) * 100)}% on annual subscription
                    </p>
                </div>
            </div>

            {/* Active state indicator */}
            {isActive && (
                <div className="absolute top-0 right-0 w-1 h-full bg-linear-to-b from-pink-500 to-pink-600 rounded-r-lg" />
            )}
        </div>
    );
}

export default OfferCard;
