import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/side-bar/side-bar";
import { useSidebarToggle } from "@/hooks/use-side-bar-toggle";
import { cn } from "@/lib/utils";

export default function AppLayout() {
  const sidebar = useSidebarToggle();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Sidebar />
      <main
        className={cn(
          "min-h-screen w-full min-w-0",
          "transition-[margin-left] duration-300 ease-in-out",
          sidebar?.isOpen === false ? "ml-[90px]" : "ml-60"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
