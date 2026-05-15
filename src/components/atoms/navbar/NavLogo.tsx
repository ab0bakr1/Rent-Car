import Link from "next/link";

interface Props {
  size?: "sm" | "lg";
}

export default function NavLogo({ size = "sm" }: Props) {
  return (
    <Link
      href="/"
      className={`group flex items-center gap-2 font-bold transition-transform duration-300 hover:scale-105 ${
        size === "lg" ? "text-4xl" : "text-2xl"
      }`}
    >
      <div className="relative">
        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-300">
          RentCar
        </span>
        {/* Subtle glow effect behind logo on hover */}
        <span className="absolute inset-0 -z-10 bg-blue-500 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-20 dark:bg-cyan-400"></span>
      </div>
    </Link>
  );
}
