import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { social } from "../data/social"
import LinkFolioInput from "../components/LinkFolioInput"
import { isValidUrl } from "../utils"
import { toast } from "sonner"
import { updateProfile } from "../api/LinkFolioApi"
import type { SocialNetwork, User } from "../types"

export default function LinkTreeView() {
  const [LinkFolioLinks, setLinkFolioLinks] = useState(social)

  const queryClient = useQueryClient()
  const user: User = queryClient.getQueryData(["user"])!

  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      const promise = () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ name: "Sonner" }), 1000)
        )
      toast.promise(promise, {
        loading: "Actualizando usuario...",
        success: "Actualizado correctamente",
      })
    },
  })

  useEffect(() => {
    const updatedData = LinkFolioLinks.map((item) => {
      const userLink = JSON.parse(user.links).find(
        (link: SocialNetwork) => link.name === item.name
      )
      if (userLink) {
        return { ...item, url: userLink.url, enabled: userLink.enabled }
      }
      return item
    })

    setLinkFolioLinks(updatedData)
  }, [])

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLinks = LinkFolioLinks.map((link) =>
      link.name === e.target.name ? { ...link, url: e.target.value } : link
    )
    setLinkFolioLinks(updatedLinks)
  }

  const links: SocialNetwork[] = JSON.parse(user.links)

  const handleEnableLink = (socialNetwork: string) => {
    const updatedLinks = LinkFolioLinks.map((link) => {
      if (link.name === socialNetwork) {
        if (isValidUrl(link.url)) {
          return { ...link, enabled: !link.enabled }
        } else {
          toast.error("URL no válida")
        }
      }
      return link
    })
    setLinkFolioLinks(updatedLinks)

    let updatedItems: SocialNetwork[] = []
    const selectedSocialNetwork = updatedLinks.find(
      (link) => link.name === socialNetwork
    )
    if (selectedSocialNetwork?.enabled) {
      const id = links.filter((link) => link.id > 0).length + 1
      if (links.some((link) => link.name === socialNetwork)) {
        updatedItems = links.map((link) => {
          if (link.name === socialNetwork) {
            return {
              ...link,
              enabled: true,
              id: id,
            }
          } else {
            return link
          }
        })
      } else {
        const newItem = {
          ...selectedSocialNetwork,
          id: id,
        }
        updatedItems = [...links, newItem]
      }
    } else {
      const indexToUpdated = links.findIndex(
        (link) => link.name === socialNetwork
      )
      updatedItems = links.map((link) => {
        if (link.name === socialNetwork) {
          return {
            ...link,
            id: 0,
            enabled: false,
          }
        } else if (
          link.id > indexToUpdated &&
          indexToUpdated !== 0 &&
          link.id === 1
        ) {
          return {
            ...link,
            id: link.id - 1,
          }
        } else {
          return link
        }
      })
    }

    // Almacenar en la BBDD
    queryClient.setQueryData(["user"], (prevData: User) => {
      return {
        ...prevData,
        links: JSON.stringify(updatedItems),
      }
    })
  }

  return (
    <>
      <div>
        <button
          className="bg-primary p-2 block mx-auto text-lg uppercase text-white rounded font-bold mb-5 shadow-lg 
             transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl transform-gpu"
         
          onClick={() => mutate(queryClient.getQueryData(["user"])!)}
        >
          Guardar cambios
        </button>
      </div>
      <div className="space-y-5">
        {LinkFolioLinks.map((item) => (
          <LinkFolioInput
            key={item.name}
            item={item}
            handleUrlChange={handleUrlChange}
            handleEnableLink={handleEnableLink}
          />
        ))}
      </div>
    </>
  )
}
