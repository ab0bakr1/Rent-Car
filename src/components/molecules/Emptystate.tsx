"use client";

import { Inbox } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = "لا توجد بيانات",
  description = "لم يتم العثور على أي عناصر مطابقة.",
  icon,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-4">
        {icon ?? <Inbox size={28} />}
      </div>
      <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-400 max-w-sm">{description}</p>
    </div>
  );
}