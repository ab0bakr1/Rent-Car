import { cn } from "@/lib/cn";
interface Props {
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  center?: boolean;
  variant?: "primary" | "secondary" | "tertairy" | "disabled";
  className?: string;
}

export default function Text({
  children,
  size = "md",
  center = false,
  variant = "primary",
  className = "pt-2.5 capitalize font-normal",
}: Props) {
  const sizes = {
    sm: "ds-text-sm",
    md: "ds-text-base",
    lg: "ds-text-lg",
    xl: "ds-text-xl",
  };
  const variants = {
    primary: "ds-text-primary",
    secondary: "ds-text-secondary",
    tertairy: "ds-text-tertairy",
    disabled: "ds-text-disabled"
  };

  return (
    <>
      <p
        className={cn(
          sizes[size],
          variants[variant],
          center ? "text-center" : "",
          className,
        )}
      >
        {children}
      </p>
    </>
  );
}
