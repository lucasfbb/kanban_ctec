import { Moon, Sunny } from "react-ionicons";
import { useDarkMode } from "../../hooks/useDarkMode";

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-colors
                 bg-orange-100 text-orange-600 dark:bg-gray-800 dark:text-white"
    >
      {darkMode ? (
        <Moon color="#fff" width="20px" height="20px" />
      ) : (
        <Sunny color="#f59e0b" width="20px" height="20px" />
      )}
      <span className="text-sm font-medium">{darkMode ? "Modo Escuro" : "Modo Claro"}</span>
    </button>
  );
};

export default ThemeToggle;
