import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { switchTheme, type Theme } from "@/lib/theme";
import { MoonIcon, SunIcon } from "lucide-react";
import { useCallback, type ReactNode } from "react";

export function ThemeSwitcher() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <SunIcon className="dark:invisible" />
          <MoonIcon className="invisible absolute dark:visible" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ThemeItem theme="light" />
        <ThemeItem theme="dark" />
        <ThemeItem theme="system" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeItem({ theme }: { readonly theme: Theme }): ReactNode {
  const handleClick = useCallback(() => {
    switchTheme(theme);
  }, [theme]);

  return (
    <DropdownMenuItem className="capitalize" onClick={handleClick}>
      {theme}
    </DropdownMenuItem>
  );
}
