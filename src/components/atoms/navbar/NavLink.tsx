import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function NavLink({
  to,
  children,
  onClick,
  className = "",
}: Props) {
  const pathname = usePathname();

  const isActive = pathname === to || pathname.startsWith(to + "/");

  return (
    <Link
      href={to}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`group relative py-2 px-1 text-sm font-semibold transition-colors duration-300
        ${
          isActive
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
        }
        ${className}`}
    >
      {children}
      <span
        className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 ease-out dark:from-blue-400 dark:to-cyan-300
          ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
      />
    </Link>
  );
}