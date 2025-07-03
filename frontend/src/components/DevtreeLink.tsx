import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useLocation } from "react-router-dom"
import type { SocialNetwork } from "../types"

type DevtreeLinkProps = {
  link: SocialNetwork
  disableDnD?: boolean
}

export default function DevtreeLink({ link, disableDnD }: DevtreeLinkProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: link.id,
    })

  const location = useLocation()
  const isProfileView = location.pathname === "/admin/profile"

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      className="bg-white px-5 py-2 flex items-center gap-5 rounded-lg"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(!disableDnD ? listeners : {})}
    >
      {isProfileView ? (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-5 w-full"
          tabIndex={link.enabled ? 0 : -1}
          style={{ pointerEvents: link.enabled ? "auto" : "none", width: "100%" }}
        >
          <div
            className="w-12 h-12 bg-cover"
            style={{ backgroundImage: `url('/social/icon_${link.name}.svg')` }}
          ></div>
          <p className="capitalize">
            Visita mi: <span className="font-bold">{link.name}</span>
          </p>
        </a>
      ) : (
        <div className="flex items-center gap-5 w-full" style={{ width: "100%" }}>
          <div
            className="w-12 h-12 bg-cover"
            style={{ backgroundImage: `url('/social/icon_${link.name}.svg')` }}
          ></div>
          <p className="capitalize">
            Visita mi: <span className="font-bold">{link.name}</span>
          </p>
        </div>
      )}
    </li>
  )
}
