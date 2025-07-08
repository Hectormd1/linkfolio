import { Link, Outlet, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import { DndContext, closestCenter } from "@dnd-kit/core"
import type { DragEndEvent } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"

import NavigationTabs from "./NavigationsTabs"
import type { SocialNetwork, User } from "../types"
import { useEffect, useState } from "react"
import LinkFolioLink from "./LinkFolioLink"
import { useQueryClient } from "@tanstack/react-query"
import Header from "./Header"

type LinkFolioProps = {
  data: User
}

export default function LinkFolio({ data }: LinkFolioProps) {
  const [enabledLinks, setEnabledLinks] = useState<SocialNetwork[]>(
    JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled)
  )

  useEffect(() => {
    setEnabledLinks(
      JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled)
    )
  }, [data])

  const queryClient = useQueryClient()

  const HandleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e

    if (over && over.id) {
      const prevIndex = enabledLinks.findIndex((link) => link.id === active.id)
      const newIdex = enabledLinks.findIndex((link) => link.id === over.id)
      const order = arrayMove(enabledLinks, prevIndex, newIdex)

      const disableLinks: SocialNetwork[] = JSON.parse(data.links).filter(
        (item: SocialNetwork) => !item.enabled
      )
      const links = order.concat(disableLinks)
      setEnabledLinks(order)

      queryClient.setQueryData(["user"], (prevData: User) => {
        return {
          ...prevData,
          links: JSON.stringify(links),
        }
      })
    }
  }

  const location = useLocation()
  const isLinkTreeView = location.pathname === "/admin"

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen">
        <main className="mx-auto max-w-5xl p-10 md:pb-8">
          <NavigationTabs />
          <div className="flex justify-end">
            <Link
              className="font-bold text-slate-800 text-2xl pr-16 pt-4"
              to={`/${data.handle}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              Visita mi perfil: /{data.handle}
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-10 mt-6">
            <div className="flex-1 ">
              <Outlet />
            </div>
            <div className="w-full md:w-96 bg-slate-800 px-5 py-10 space-y-6 rounded-lg">
              <p className="text-4xl text-center text-white">{data.handle}</p>
              {data.image && (
                <img
                  src={data.image}
                  alt="Imagen Perfil"
                  className="mx-auto max-w-[250px]"
                />
              )}
              <p className="text-lg text-center font-black text-white">
                {data.description}
              </p>

              {isLinkTreeView ? (
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={HandleDragEnd}
                >
                  <div className="mt-20 flex flex-col gap-5">
                    <SortableContext
                      items={enabledLinks}
                      strategy={verticalListSortingStrategy}
                    >
                      {enabledLinks.map((link) => (
                        <LinkFolioLink key={link.name} link={link} />
                      ))}
                    </SortableContext>
                  </div>
                </DndContext>
              ) : (
                <div className="mt-20 flex flex-col gap-5">
                  {enabledLinks.map((link) => (
                    <LinkFolioLink key={link.name} link={link} disableDnD />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </>
  )
}
