import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const setTheme = (theme: "light" | "dark" | "system") => {
  const de = document.documentElement;

  de.classList.remove("dark");

  if (theme === "system") {
    const { matches: prefersDark } = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    if (prefersDark) {
      de.classList.add("dark");
    } 

    localStorage.removeItem("theme");
  } else {
    de.classList.add(theme);
    localStorage.setItem("theme", theme);
  }
};

export function ThemeSwitcher() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <SunIcon className="scale-100 dark:invisible" />
          <MoonIcon className="absolute invisible dark:visible" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
