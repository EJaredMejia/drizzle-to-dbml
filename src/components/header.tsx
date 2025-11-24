import { Github } from "@/icons/github";
import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="p-4 flex items-center justify-between bg-gray-800 text-white shadow-lg">
      <h1 className="text-xl font-semibold">Drizzle to DBML</h1>

      <div className="w-9">
        <Link
          to={"https://github.com/EJaredMejia/drizzle-to-dbml" as string}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
        >
          <Github />
        </Link>
      </div>
    </header>
  );
}
