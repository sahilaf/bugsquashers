import { Link } from "react-router-dom"
import { Bell, ChevronRight } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./../../../components/ui/dropdown-menu"
import Profile01 from "./Profile01";

export default function TopNav() {
  const breadcrumbs = [
    { label: "kokonutUI", href: "#" },
    { label: "dashboard", href: "#" },
  ]

  return (
    <nav className="px-3 sm:px-6 flex items-center justify-between bg-background border-b border-[#1F1F23] h-full z-10">
      <div className="font-medium text-sm hidden sm:flex items-center space-x-1 truncate max-w-[300px]">
        {breadcrumbs.map((item, index) => (
          <div key={item.label} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />}
            {item.href ? (
              <Link to={item.href} className="text-gray-300 hover:text-white transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-white">{item.label}</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-auto sm:ml-0">
        <button type="button" className="p-1.5 sm:p-2 hover:bg-[#1F1F23] rounded-full transition-colors">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <img
              src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png"
              alt="User avatar"
              className="w-7 h-7 rounded-full ring-2 ring-[#2B2B30] sm:w-8 sm:h-8 cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-[280px] sm:w-80 bg-[#1F1F23] border-[#2B2B30] rounded-lg shadow-lg"
          >
            <Profile01 avatar="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png" />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

