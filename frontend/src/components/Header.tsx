import { useLocation } from "react-router-dom"
import AdminNavigation from "./nav/AdminNavigation"
import HomeNavigation from "./nav/HomeNavigation"
import Logo from "./Logo"
import { useQueryClient } from "@tanstack/react-query"

export default function Header() {
  const location = useLocation()
  const queryClient = useQueryClient()
  const user = queryClient.getQueryData(["user"])

  return (
    <header className="bg-slate-800 py-5">
      <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center md:justify-between">
        <div className="w-full p-5 lg:p-0 md:w-1/3">
          <Logo/>
        </div>
        <nav className="md:w-1/3 md:flex md:justify-end">
          {location.pathname === "/" 
            ? user 
              ? <AdminNavigation /> 
              : <HomeNavigation /> 
            : <AdminNavigation />}
        </nav>
      </div>
    </header>
  )
}
