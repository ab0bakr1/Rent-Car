"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-6" dir="ltr">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, idx) => {
        const prev = pages[idx - 1];
        const showDots = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {showDots && <span className="text-gray-400 px-1">…</span>}
            <button
              onClick={() => onPageChange(p)}
              className={cn(
                "w-9 h-9 rounded-lg text-sm font-medium transition-colors",
                p === page
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}