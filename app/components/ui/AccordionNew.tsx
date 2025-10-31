/**
 * Enhanced Accordion Component with Tailwind v4
 */

"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/app/lib/utils/helpers";

interface AccordionProps {
  question: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export default function Accordion({
  question,
  children,
  defaultOpen = false,
  className = "",
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300",
        isOpen && "shadow-md",
        className
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
      >
        <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
        <svg
          className={cn(
            "w-5 h-5 text-gray-500 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 py-4 border-t border-gray-100 text-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
}
