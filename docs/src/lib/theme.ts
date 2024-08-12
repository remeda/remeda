export type Theme = "light" | "dark" | "system";

const LOCAL_STORAGE_KEY = "theme";

const DARK_THEME_CLASS = "dark";

const ALGOLIA_DOCSEARCH_DARK_THEME_DATA_ATTRIBUTE = "theme";
const ALGOLIA_DOCSEARCH_DARK_THEME_VALUE = "dark";

export function initTheme(): void {
  const storedTheme = getStoredTheme();

  const prefersDarkMediaQuery = window.matchMedia(
    "(prefers-color-scheme: dark)",
  );

  setDarkMode(
    storedTheme === "dark" ||
      (storedTheme === null && prefersDarkMediaQuery.matches),
  );

  prefersDarkMediaQuery.addEventListener(
    "change",
    ({ matches: prefersDark }) => {
      setDarkMode(prefersDark && getStoredTheme() !== null);
    },
  );
}

export function switchTheme(theme: Theme): void {
  setDarkMode(false);

  if (theme === "system") {
    const { matches: prefersDark } = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    if (prefersDark) {
      setDarkMode();
    }

    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } else {
    if (theme === "dark") {
      setDarkMode();
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, theme);
  }
}

function setDarkMode(isEnabled = true): void {
  const { documentElement } = document;

  if (isEnabled) {
    documentElement.classList.add(DARK_THEME_CLASS);

    documentElement.dataset[ALGOLIA_DOCSEARCH_DARK_THEME_DATA_ATTRIBUTE] =
      ALGOLIA_DOCSEARCH_DARK_THEME_VALUE;
  } else {
    documentElement.classList.remove(DARK_THEME_CLASS);

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- Intentional! This is the idiomatic way to remove a data attribute.
    delete documentElement.dataset[ALGOLIA_DOCSEARCH_DARK_THEME_DATA_ATTRIBUTE];
  }
}

const getStoredTheme = () =>
  localStorage.getItem(LOCAL_STORAGE_KEY) as Theme | null;
