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

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  showSidebarTrigger?: boolean;
  className?: string;
}

export function AppHeader({
  breadcrumbs = [],
  showSidebarTrigger = true,
  className = "",
}: AppHeaderProps) {
  const hasBreadcrumbs = breadcrumbs.length > 0;

  return (
    <header className={`flex h-16 shrink-0 items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2 px-4">
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
                      <BreadcrumbLink href={item.href}>
                        {item.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {i < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
    </header>
  );
}
