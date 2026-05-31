"use client"

import { Button } from "../button";
import { Share2 } from 'lucide-react';

export default function ShareButton() {
    const copyUrl = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert("URL copied!");
        } catch (error) {
            console.error("Failed to copy URL:", error);
        }
    };
    return (
        <Button
            className="bg-rose-500 hover:bg-rose-600 text-white cursor-pointer flex items-center p-4 pr-5"
            onClick={copyUrl}
        >
            <Share2 className="text-white flex items-center size-3.5" />
            <p className="mt-0.5">Share</p>
        </Button>
    )
}
