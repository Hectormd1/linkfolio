import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { SocialNetwork } from "../types"

type DevtreeLinkProps = {
  link: SocialNetwork
}

export default function DevtreeLink({ link }: DevtreeLinkProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: link.id,
    })

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
      {...listeners}
    >
      <div
        className="w-12 h-12 bg-cover"
        style={{ backgroundImage: `url('/social/icon_${link.name}.svg')` }}
      ></div>

      <p className="capitalize">
        Visita mi: <span className="font-bold">{link.name}</span>
      </p>
    </li>
  )
}
