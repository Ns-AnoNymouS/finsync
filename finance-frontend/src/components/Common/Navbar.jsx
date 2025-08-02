import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="p-4 shadow bg-card flex justify-between items-center">
      <h1 className="text-xl font-bold">Finance Dashboard</h1>
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="p-2 rounded-full hover:bg-muted"
      >
        {theme === "light" ? <Moon /> : <Sun />}
      </button>
    </nav>
  );
};

export default Navbar;