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

  de.classList.remove("light", "dark");

  if (theme === "system") {
    const { matches: prefersDark } = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    if (prefersDark) {
      de.classList.add("dark");
      de.style.colorScheme = "dark";
    } else {
      de.classList.add("light");
      de.style.colorScheme = "light";
    }
  } else {
    de.classList.add(theme);
    de.style.colorScheme = theme;
  }

  localStorage.setItem("theme", theme);
};

export function ModeSwitcher() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <SunIcon className="scale-100 dark:scale-0" />
          <MoonIcon className="absolute scale-0 dark:scale-100" />
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
