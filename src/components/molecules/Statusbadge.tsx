import { cn } from "@/lib/cn";

type StatusColor = "green" | "yellow" | "red" | "blue" | "gray" | "purple" | "orange";

const COLOR_MAP: Record<StatusColor, string> = {
  green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  gray: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

interface Props {
  label: string;
  color: StatusColor;
  className?: string;
}

export default function StatusBadge({ label, color, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap",
        COLOR_MAP[color],
        className
      )}
    >
      {label}
    </span>
  );
}