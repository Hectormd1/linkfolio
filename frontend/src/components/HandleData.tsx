import type { SocialNetwork, UserHandle } from "../types"
import AdSidebar from "./AdSidebar"

type HandleDataProps = {
  data: UserHandle
}

export default function HandleData({ data }: HandleDataProps) {
  const links: SocialNetwork[] = JSON.parse(data.links).filter(
    (link: SocialNetwork) => link.enabled
  )

  return (
    <div className="flex w-full min-h-screen relative">
      {/* Lateral izquierdo (desktop) */}
      <div className="hidden lg:block fixed left-0 top-1/2 -translate-y-1/2 w-[240px] z-10">
        <div className="sticky top-10">
          <AdSidebar />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex justify-center px-4 pb-[600px] lg:pb-10">
        <div className="max-w-2xl w-full pt-10 space-y-6 text-white">
          <p className="text-5xl text-center font-bold text-primary">
            {data.name}
          </p>
          {data.image && (
            <img
              src={data.image}
              className="max-w-[250px] mx-auto rounded-xl"
            />
          )}
          <p
            className="text-lg text-center font-black text-white"
            style={{ whiteSpace: "pre-line" }}
          >
            {data.description}
          </p>
          <p
            className="text-xl text-center font-bold text-secondary"
            style={{ whiteSpace: "pre-line" }}
          >
            📧 {data.email}
          </p>

          <div className="mt-20 flex flex-col gap-6">
            {links.length ? (
              links.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  className="bg-white px-5 py-2 rounded-lg flex items-center gap-5 w-full max-w-xs mx-auto transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl transform-gpu"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <img
                    src={`/social/icon_${link.name}.svg`}
                    alt="imagen red social"
                    className="w-12"
                  />
                  <p className="text-black text-lg">
                    Visita mi:{" "}
                    <span className="capitalize font-bold">{link.name}</span>
                  </p>
                </a>
              ))
            ) : (
              <p className="text-center">
                No hay enlaces disponibles en este perfil
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Lateral derecho (desktop) */}
      <div className="hidden lg:block fixed right-0 top-1/2 -translate-y-1/2 w-[240px] z-10">
        <div className="sticky top-10">
          <AdSidebar />
        </div>
      </div>

      {/* Footer ad (mobile only) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-20 bg-[#111] px-2 py-3">
        <AdSidebar size="footer" />
      </div>
    </div>
  )
}
