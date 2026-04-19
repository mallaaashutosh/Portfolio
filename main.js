(function () {
  const themeToggleButton = document.querySelector(".theme-toggle");
  const userThemeStorageKey = "preferred-theme";
  const lightTheme = "light";
  const darkTheme = "dark";

  function setTheme(theme) {
    const selectedTheme = theme === lightTheme ? lightTheme : darkTheme;
    document.documentElement.setAttribute("data-theme", selectedTheme);

    if (themeToggleButton) {
      const nextTheme = selectedTheme === lightTheme ? darkTheme : lightTheme;
      const label = nextTheme === lightTheme ? "Light mode" : "Dark mode";
      themeToggleButton.textContent = label;
      themeToggleButton.setAttribute("aria-label", `Switch to ${label.toLowerCase()}`);
    }
  }

  function initTheme() {
    const storedTheme = window.localStorage.getItem(userThemeStorageKey);
    if (storedTheme === lightTheme || storedTheme === darkTheme) {
      setTheme(storedTheme);
      return;
    }

    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    setTheme(prefersLight ? lightTheme : darkTheme);
  }

  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const nextTheme = currentTheme === lightTheme ? darkTheme : lightTheme;
      setTheme(nextTheme);
      window.localStorage.setItem(userThemeStorageKey, nextTheme);
    });
  }

  initTheme();

  const sections = document.querySelectorAll("[data-nav-section]");
  const links = document.querySelectorAll(".toc__link");
  if (!sections.length || !links.length) return;

  const markerRatio = 0.32;

  function setActive(id) {
    links.forEach((a) => {
      const href = a.getAttribute("href");
      a.classList.toggle("is-active", href === `#${id}`);
    });
  }

  function updateActive() {
    const doc = document.documentElement;
    const nearBottom =
      window.scrollY + window.innerHeight >= doc.scrollHeight - 8;
    if (nearBottom) {
      const last = sections[sections.length - 1];
      if (last && last.id) setActive(last.id);
      return;
    }

    const marker = window.innerHeight * markerRatio;
    let current = sections[0];
    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= marker) current = sec;
    });
    if (current && current.id) setActive(current.id);
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
    },
    { passive: true }
  );

  window.addEventListener("resize", updateActive, { passive: true });
  updateActive();
})();
