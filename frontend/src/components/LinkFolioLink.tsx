import { Bars3Icon } from "@heroicons/react/24/outline"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useLocation } from "react-router-dom"
import type { SocialNetwork } from "../types"

type LinkFolioLinkProps = {
  link: SocialNetwork
  disableDnD?: boolean
}

export default function LinkFolioLink({ link, disableDnD }: LinkFolioLinkProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: link.id })

  const location = useLocation()
  const isProfileView = location.pathname === "/admin/profile"

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      className="bg-white px-2 md:px-5 py-2 flex items-center gap-0.5 md:gap-5 rounded-lg"
      ref={setNodeRef}
      style={style}
      {...(!disableDnD ? { ...attributes, ...listeners } : {})}
    >
      {/* Handle solo visible y funcional en móvil/tablet */}
      {!disableDnD && (
        <div
          className="block lg:hidden cursor-grab active:cursor-grabbing touch-none mr-2"
          {...(window.innerWidth < 1024 ? { ...attributes, ...listeners } : {})}
        >
          <Bars3Icon className="w-6 h-6 text-gray-400" />
        </div>
      )}
      {isProfileView ? (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 md:gap-5 w-full transition-all duration-300 ease-in-out hover:scale-105 transform-gpu"
          tabIndex={link.enabled ? 0 : -1}
          style={{ pointerEvents: link.enabled ? "auto" : "none", width: "100%" }}
        >
          <div
            className="w-12 h-12 bg-cover ml-2 md:ml-0"
            style={{ backgroundImage: `url('/social/icon_${link.name}.svg')` }}
          ></div>
          <p>
            Visita mi: <span className="capitalize font-bold">{link.name}</span>
          </p>
        </a>
      ) : (
        <div
          className="flex items-center gap-2 md:gap-5 w-full transition-all duration-300 ease-in-out hover:scale-105 transform-gpu"
          style={{ width: "100%" }}
        >
          <div
            className="w-12 h-12 bg-cover ml-2 md:ml-0"
            style={{ backgroundImage: `url('/social/icon_${link.name}.svg')` }}
          ></div>
          <p>
            Visita mi: <span className="capitalize font-bold">{link.name}</span>
          </p>
        </div>
      )}
    </li>
  )
}
