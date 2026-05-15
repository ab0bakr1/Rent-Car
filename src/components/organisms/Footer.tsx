"use client";
import Text from "../atoms/Text";
import Title from "../atoms/Title";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export default function Footer() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer className="ds-bg py-12">
      <div className="ds-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Title variant="primary" size="lg" center={false}>
            Rent<span className="ds-text-tertairy">Car</span>
          </Title>
          <Text variant="disabled" size="sm">
            Your trusted partner for car rentals. Quality, safety, and
            convenience at your fingertips.
          </Text>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <Title variant="primary" size="md" center={false}>
            Quick Links
          </Title>
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={cn(
                  "ds-text-secondary hover:ds-text-tertairy transition-colors",
                  pathname === link.path && "ds-text-tertairy font-bold",
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Services */}
        <div className="flex flex-col gap-4">
          <Title variant="primary" size="md" center={false}>
            Services
          </Title>
          <ul className="flex flex-col gap-2 ds-text-secondary text-sm">
            <li>✓ Car Rentals</li>
            <li>✓ Airport Transfers</li>
            <li>✓ 24/7 Support</li>
            <li>✓ Flexible Plans</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4">
          <Title variant="primary" size="md" center={false}>
            Contact Info
          </Title>
          <div className="flex flex-col gap-2 ds-text-secondary text-sm">
            <p>Email: [EMAIL_ADDRESS]</p>
            <p>Phone: +123 456 7890</p>
            <p>Address: 123 Main St, Anytown, USA</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 pt-8 border-t border-white/10">
        <Text variant="disabled" size="sm" center={true}>
          © 2024 RentCar. All rights reserved.
        </Text>
      </div>
    </footer>
  );
}
