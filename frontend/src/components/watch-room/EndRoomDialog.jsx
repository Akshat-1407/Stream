"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export default function EndRoomDialog({ open, isEnding, onOpenChange, onConfirm }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-neutral-900 text-white border border-neutral-700">
                <DialogHeader>
                    <DialogTitle>End watch room?</DialogTitle>
                    <DialogDescription>
                        This will end the watch party for everyone and remove the room permanently.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isEnding}
                        className="bg-red-700 text-white hover:bg-red-800"
                    >
                        {isEnding && <Loader2 className="w-4 h-4 animate-spin" />}
                        End Room
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
