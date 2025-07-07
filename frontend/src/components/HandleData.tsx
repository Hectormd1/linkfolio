import type { SocialNetwork, UserHandle } from "../types"

type HandleDataProps = {
  data: UserHandle
}

export default function HandleData({ data }: HandleDataProps) {
  const links: SocialNetwork[] = JSON.parse(data.links).filter(
    (link: SocialNetwork) => link.enabled
  )

  return (
    <div className="space-y-6 text-white">
      <p className="text-5xl text-center font-black">{data.handle}</p>
      {data.image && <img src={data.image} className="max-w-[250px] mx-auto" />}
      <p className="text-lg text-center font-bold">{data.description}</p>
      <div className="mt-20 flex flex-col gap-6 ">
        {links.length
         ? links.map(link => (
            <a
              key={link.name}
              href={link.url}
              className="bg-white px-5 py-2 rounded-lg flex items-center gap-5 w-full max-w-xs mx-auto transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl transform-gpu"
              target="_blank"
              rel="noreferrer noopener"
            >
              <img src={`/social/icon_${link.name}.svg`} alt="imagen red social" className="w-12"/>
              <p className="text-black capitalize font-bold text-lg">Visita mi: {link.name}</p>
            </a>
         ))
         : <p className="text-center">No hay enlaces disponibles en este perfil</p>}
      </div>
    </div>
  )
}
