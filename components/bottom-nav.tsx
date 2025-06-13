"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { VideoIcon, UploadCloud, Home } from "lucide-react";
import { cn } from "@/lib/utils"; // ou utilise clsx/twMerge si tu préfères

const navItems = [
  {
    title: "Accueil",
    href: "/",
    icon: Home,
  },
  {
    title: "Vidéos",
    href: "/video",
    icon: VideoIcon,
  },
  {
    title: "Téléchargements",
    href: "/download",
    icon: UploadCloud,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t bg-background shadow-sm sm:hidden">
      <ul className="flex justify-around items-center h-12">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center text-xs font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="mb-1 h-5 w-5" />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
