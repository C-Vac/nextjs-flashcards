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
      className={cn("perspective w-full max-w-md h-64 mb-4 cursor-pointer group", className)}
      onClick={onFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && onFlip()}
    >
      <div
        className={cn(
          "relative w-full h-full rounded-lg shadow-md transition-transform duration-700 transform-style-3d",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center p-6 text-center overflow-auto">
          <p className="text-lg sm:text-xl text-blue-800">{front}</p>
        </div>
        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-green-100 border border-green-200 rounded-lg flex items-center justify-center p-6 text-center overflow-auto">
          <p className="text-lg sm:text-xl text-green-800">{back}</p>
        </div>
      </div>
    </div>
  );
}