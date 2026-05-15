import Link from "next/link";

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
  return (
    <Link
      href={to}
      onClick={onClick}
      className={`group relative py-2 px-1 text-sm font-semibold text-gray-600 transition-colors duration-300 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 ${className}`}
    >
      {children}
      <span className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 ease-out group-hover:w-full dark:from-blue-400 dark:to-cyan-300"></span>
    </Link>
  );
}
