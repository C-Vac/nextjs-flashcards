"use client";

import { cn } from "@/lib/utils";

interface FlipCardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
  className?: string;
}

export function FlipCard({ front, back, isFlipped, onFlip, className }: FlipCardProps) {
  return (
    <div
      className={cn("perspective w-full max-w-xl h-80 sm:h-96 mb-8 cursor-pointer group", className)}
      onClick={onFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && onFlip()}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:scale-[1.02] shadow-xl hover:shadow-2xl rounded-2xl",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center p-8 sm:p-12 text-center overflow-auto shadow-sm">
          <p className="text-2xl sm:text-3xl font-medium text-gray-800 leading-relaxed">
            {front}
          </p>
          <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-300 uppercase tracking-widest font-semibold">
            Tap to reveal
          </div>
        </div>
        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl flex flex-col items-center justify-center p-8 sm:p-12 text-center overflow-auto shadow-sm">
          <p className="text-xl sm:text-2xl text-gray-800 leading-relaxed font-normal">
            {back}
          </p>
        </div>
      </div>
    </div>
  );
}