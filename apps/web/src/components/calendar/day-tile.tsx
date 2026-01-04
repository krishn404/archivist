"use client";

import React, { useState } from "react";
import type { DayInfo, DayEntry, Review } from "@/lib/types";
import {
  LEGEND_CONFIG,
  DEFAULT_COLOR,
  DEFAULT_TEXT_COLOR,
} from "@/lib/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { isFutureDate } from "@/lib/date-utils";
import { toast } from "sonner";

interface DayTileProps {
  day: DayInfo | null;
  entry?: DayEntry;
  reviews?: Review[];
  onClick: (day: DayInfo) => void;
  showReviews?: boolean; // For public profile
}

export const DayTile: React.FC<DayTileProps> = ({
  day,
  entry,
  reviews = [],
  onClick,
  showReviews = true,
}) => {
  const [open, setOpen] = useState(false);

  if (!day) {
    return (
      <div className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 invisible shrink-0" />
    );
  }

  const legend = entry?.legend;
  const config = legend ? LEGEND_CONFIG[legend] : null;
  const isDefault = !legend;
  const isFuture = isFutureDate(day.dateKey);

  // Determine tooltip content
  const hasReviews = reviews && reviews.length > 0;
  const shouldShowReviews = showReviews && hasReviews;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);

    if (isFuture) {
      toast.error("Cannot create entries for future dates", {
        description: "You can only log entries for today or past dates.",
      });
      return;
    }

    onClick(day);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        onClick={handleClick}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`
          w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-md flex items-center justify-center shrink-0
          transition-all duration-200 transform hover:scale-110 relative
          shadow-sm border border-transparent
          ${isDefault ? "hover:bg-[#3F3F46]" : "hover:brightness-125"}
        `}
        style={{
          backgroundColor: config ? config.color : DEFAULT_COLOR,
          boxShadow: !isDefault ? `0 0 10px ${config?.color}44` : "none",
        }}
      >
        <span
          className={`text-[9px] md:text-[10px] lg:text-xs font-bold transition-colors ${
            !isDefault ? "opacity-90" : "text-gray-500"
          }`}
          style={{
            color: !isDefault && config ? config.textColor : DEFAULT_TEXT_COLOR,
          }}
        >
          {day.dayNumber.toString().padStart(2, "0")}
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="bg-[#1A1A1E] text-white text-xs rounded-lg border border-[#3F3F46] shadow-2xl w-80 p-0 h-fit"
        side="top"
        align="center"
        sideOffset={8}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {/* Date Header */}
        <div className="px-3 py-2 border-b border-[#3F3F46]">
          <p className="font-bold text-[10px] text-gray-400">
            {new Date(day.dateKey).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Mood (if exists) */}
        {config && (
          <div className="px-3 py-2 border-b border-[#3F3F46]">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded shrink-0"
                style={{ backgroundColor: config.color }}
              />
              <p className="font-semibold text-xs text-gray-200">
                {config.label}
              </p>
            </div>
          </div>
        )}

        {/* Reviews (if exists and should show) */}
        {shouldShowReviews && (
          <div className="px-3 py-2 space-y-2 max-h-fit overflow-y-auto">
            {reviews.map((review, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {review.category === "CUSTOM"
                    ? "Custom"
                    : review.category.charAt(0) +
                      review.category.slice(1).toLowerCase()}
                </p>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  {review.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* No entry message */}
        {!config && (
          <div className="px-3 py-2">
            <p className="text-[10px] text-gray-500 italic">No entry yet</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
