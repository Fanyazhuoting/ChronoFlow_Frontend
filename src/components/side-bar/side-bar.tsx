// src/components/Sidebar.tsx
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/side-bar/menu";
import { useSidebarToggle } from "@/hooks/use-side-bar-toggle";
import { SidebarToggle } from "./side-bar-toggle";

export function Sidebar() {
  const isOpen = useSidebarToggle((s) => s.isOpen);
  const toggle = useSidebarToggle((s) => s.setIsOpen);

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0",
        "transition-[width] ease-in-out duration-300 bg-card",
        isOpen ? "w-60" : "w-[90px]"
      )}
    >
      <SidebarToggle isOpen={isOpen} onToggle={toggle} />

      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md">
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 h-auto pb-4",
            isOpen === false ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link to="/">
            <h1
              className={cn(
                "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300 h-auto",
                isOpen === false
                  ? "-translate-x-96 opacity-0 hidden"
                  : "translate-x-0 opacity-100"
              )}
            ></h1>
          </Link>
        </Button>

        <Menu isOpen={isOpen} />
      </div>
    </aside>
  );
}
