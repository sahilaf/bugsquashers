import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";

import PropTypes from "prop-types";

const ThemeToggle = ({ showText = false }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Button
      variant="outline"
      size={showText ? "default" : "icon"}
      className={`flex items-center justify-center gap-2 p-2 bg-transparent hover:bg-accent rounded-full hover:text-secondary-foreground ${
        showText ? "w-full" : ""
      }`}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      {showText && <span>{theme === "light" ? "Dark" : "Light"}</span>}
    </Button>
  );
};

ThemeToggle.propTypes = {
  showText: PropTypes.bool,
};

export default ThemeToggle;