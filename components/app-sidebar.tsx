"use client";

import * as React from "react";
import { UploadCloud, VideoIcon } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";

const data = {
  navMain: [
    {
      title: "Vidéos",
      url: "/video",
      icon: VideoIcon,
    },
    {
      title: "Téléchargements",
      url: "/download",
      icon: UploadCloud,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavUser />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
