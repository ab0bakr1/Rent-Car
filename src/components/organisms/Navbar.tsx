import { useEffect, useState } from "react";
import { Routes } from "@/utils/routes";
import DesktopNavLinks from "../molecules/navbar/DesktopNavLinks";
import MobileNavHeader from "../molecules/navbar/MobileNavHeader";
import MobileNavLinks from "../molecules/navbar/MobileNavLinks";
import Button from "../atoms/Button";
import NavIconButton from "../atoms/navbar/NavIconButton";
import { ListMinus } from "../../../public/assets/icons/icons";
import NavLogo from "../atoms/navbar/NavLogo";
import { cn } from "../../lib/cn";
import { ThemeToggle } from "../atoms/ThemeButton";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const mainRoutes = Routes.filter((r) => r.id <= 3);
  const dropdownRoutes = Routes.filter((r) => r.id > 3);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeNavbar = () => {
    setOpen(false);
    setDropdownOpen(false);
  };

  return (
    <div className="fixed top-0 z-50 flex w-full justify-center px-4 pt-4 md:px-8">
      <nav
        className={cn(
          "flex w-full items-center justify-between transition-all duration-500 ease-in-out",
          isScrolled
            ? "h-16 max-w-7xl rounded-full border border-gray-200/50 bg-white/70 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70 dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]"
            : "h-20 max-w-7xl bg-transparent px-2"
        )}
      >
        {/* Desktop */}
        <div className="hidden w-full items-center justify-between md:flex">
          <NavLogo />

        <DesktopNavLinks
          mainRoutes={mainRoutes}
          dropdownRoutes={dropdownRoutes}
          dropdownOpen={dropdownOpen}
          toggleDropdown={() => setDropdownOpen((p) => !p)}
          closeNavbar={closeNavbar}
        />

        <div className="flex items-center gap-4">
          <Button size="md">login</Button>
          <ThemeToggle />
        </div>
        </div>

        {/* Mobile */}
        <div className="flex w-full items-center justify-between md:hidden">
          <NavLogo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NavIconButton onClick={() => setOpen(true)}>
              <ListMinus size={24} />
            </NavIconButton>
          </div>
        </div>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-50 h-screen w-full bg-white/95 backdrop-blur-lg transition-transform duration-500 ease-in-out dark:bg-gray-900/95 md:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <MobileNavHeader onClose={closeNavbar} />
        <MobileNavLinks
          mainRoutes={mainRoutes}
          dropdownRoutes={dropdownRoutes}
          dropdownOpen={dropdownOpen}
          toggleDropdown={() => setDropdownOpen((p) => !p)}
          closeNavbar={closeNavbar}
        />
      </div>
    </div>
  );
}