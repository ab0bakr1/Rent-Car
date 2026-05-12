import { cn } from "@/lib/cn";

interface Props {
    options: { value: string; label: string }[];
    placeholder: string;
    className?: string;
    required?: boolean;
    disabled?: boolean;
    onChange?: (value: string) => void;
    value?: string;
}
export default function Select({ options, placeholder, className, required, disabled, onChange, value }: Props) {
    return (
        <div className="relative">
            <select
                className={cn(
                    "w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent",
                    "ds-bg-alt dark:text-white",
                    "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                    "outline-none",
                    className
                )}
                required={required}
                disabled={disabled}
                onChange={(e) => onChange?.(e.target.value)}
                value={value}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}