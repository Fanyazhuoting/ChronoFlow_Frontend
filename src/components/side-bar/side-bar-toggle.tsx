import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function SidebarToggle({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="absolute -right-4 top-4 z-30">
      <Button
        size="icon"
        variant="outline"
        className="rounded-full shadow-sm"
        onClick={onToggle}
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </Button>
    </div>
  );
}