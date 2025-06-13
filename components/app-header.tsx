import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  showSidebarTrigger?: boolean;
  actionsSlot?: React.ReactNode;
  className?: string;
}

export function AppHeader({
  breadcrumbs = [],
  showSidebarTrigger = true,
  actionsSlot,
  className = "",
}: AppHeaderProps) {
  const hasBreadcrumbs = breadcrumbs.length > 0;

  return (
    <header
      className={`flex h-16 shrink-0 items-center justify-between px-4 gap-2 ${className}`}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        {showSidebarTrigger && <SidebarTrigger className="-ml-1" />}
        {showSidebarTrigger && hasBreadcrumbs && (
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        )}

        {hasBreadcrumbs && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, i) => (
                <React.Fragment key={i}>
                  <BreadcrumbItem>
                    {item.href ? (
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>
                        <span
                          className="max-w-[150px] truncate inline-block align-bottom"
                          title={item.label}
                        >
                          {item.label}
                        </span>
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {i < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>

      {actionsSlot && (
        <div className="flex items-center gap-2">{actionsSlot}</div>
      )}
    </header>
  );
}
