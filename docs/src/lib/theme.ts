export type Theme = "light" | "dark" | "system";

const LOCAL_STORAGE_KEY = "theme";

const DARK_THEME_CLASS = "dark";

export function initTheme(): void {
  const {
    documentElement: { classList },
  } = document;

  const storedTheme = getStoredTheme();

  const prefersDarkMediaQuery = window.matchMedia(
    "(prefers-color-scheme: dark)",
  );

  if (
    storedTheme === "dark" ||
    (storedTheme === null && prefersDarkMediaQuery.matches)
  ) {
    classList.add(DARK_THEME_CLASS);
  } else {
    classList.remove(DARK_THEME_CLASS);
  }

  prefersDarkMediaQuery.addEventListener(
    "change",
    ({ matches: prefersDark }) => {
      if (prefersDark && getStoredTheme() !== null) {
        classList.add(DARK_THEME_CLASS);
      } else {
        classList.remove(DARK_THEME_CLASS);
      }
    },
  );
}

export function switchTheme(theme: Theme): void {
  const {
    documentElement: { classList },
  } = document;

  classList.remove("dark");

  if (theme === "system") {
    const { matches: prefersDark } = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    if (prefersDark) {
      classList.add(DARK_THEME_CLASS);
    }

    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } else {
    if (theme === "dark") {
      classList.add(DARK_THEME_CLASS);
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, theme);
  }
}

const getStoredTheme = () =>
  localStorage.getItem(LOCAL_STORAGE_KEY) as Theme | null;
