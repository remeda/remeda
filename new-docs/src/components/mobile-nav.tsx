import { Button } from "@/components/ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Navbar } from "@/components/navbar";
import { useState } from "react";

export const MobileNav = (props: {
  entries: Record<string, Array<{ name: string }>>;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <HamburgerMenuIcon />
        </Button>
      </SheetTrigger>

      <SheetContent>
        <div className="h-[calc(100vh-1.5rem)] pb-10 pt-6">
          <Navbar entries={props.entries} onSelect={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
