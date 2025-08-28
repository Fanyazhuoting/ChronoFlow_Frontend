import { type LucideIcon, PlusCircle, Cog, User } from "lucide-react";
import type { User as UserLike } from "./type";

export type Submenu = { href: string; label: string; active: boolean };
export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};
export type Group = { groupLabel: string; menus: Menu[] };

export function getMenuList(pathname: string, user: UserLike): Group[] {
  return [
    {
      groupLabel: "Administration",
      menus: [
        {
          href: "/members",
          label: "Member",
          active: pathname === "/members",
          submenus: [],
          icon: User,
        },
        {
          href: "/test",
          label: "Test",
          active: pathname === "/test",
          submenus: [],
          icon: Cog,
        },
      ],
    },
  ];
}
