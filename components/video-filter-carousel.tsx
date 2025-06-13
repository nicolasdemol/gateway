"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

const FILTERS = [
  { label: "Toutes", value: "all" },
  { label: "Bunkr", value: "bunkr" },
  { label: "Locales", value: "local" },
  { label: "Chiffrées", value: "encrypted" },
  { label: "Web", value: "direct" },
];

export function VideoFilterCarousel({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (val: string) => void;
}) {
  return (
    <div className="relative flex justify-between md:justify-normal md:gap-6 overflow-x-auto pb-2 no-scrollbar">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onSelect(filter.value)}
          className={clsx(
            "relative px-1 pb-1 text-lg font-medium transition-colors",
            selected === filter.value ? "text-primary" : "text-muted-foreground"
          )}
        >
          {selected === filter.value && (
            <motion.div
              layoutId="underline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">{filter.label}</span>
        </button>
      ))}
    </div>
  );
}
