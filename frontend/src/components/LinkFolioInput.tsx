import type { LinkFolioLink } from "../types"
import { Switch } from "@headlessui/react"
import { classNames } from "../utils"

type LinkFolioInputProps = {
  item: LinkFolioLink
  handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleEnableLink: (socialNetwork: string) => void
}

export default function LinkFolioInput({
  item,
  handleUrlChange,
  handleEnableLink
}: LinkFolioInputProps) {

  return (
    <div className="bg-white shadow-lg p-5 rounded-lg">
      {/* Móvil/tablet: icono y switch centrados en fila, input debajo */}
      <div className="flex flex-col gap-0.5 md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:p-1">
        {/* Icono y switch juntos y centrados en móvil, separados en PC */}
        <div className="flex justify-center items-center gap-4 md:block md:justify-start md:items-center md:col-start-1">
          <div
            className="w-12 h-12 bg-cover"
            style={{ backgroundImage: `url('/social/icon_${item.name}.svg')` }}
          ></div>
          {/* Switch junto al icono en móvil, oculto en PC */}
          <div className="md:hidden">
            <Switch
              checked={item.enabled}
              onChange={() => handleEnableLink(item.name)}
              className={classNames(
                item.enabled ? "bg-primary" : "bg-gray-200",
                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  item.enabled ? "translate-x-5" : "translate-x-0",
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                )}
              />
            </Switch>
          </div>
        </div>
        {/* Input */}
        <input
          type="text"
          className="w-full border border-gray-100 rounded-lg mt-0.5 md:mt-0 md:ml-2"
          value={item.url}
          onChange={handleUrlChange}
          name={item.name}
        />
        {/* Switch en PC */}
        <div className="hidden md:block md:ml-4">
          <Switch
            checked={item.enabled}
            onChange={() => handleEnableLink(item.name)}
            className={classNames(
              item.enabled ? "bg-primary" : "bg-gray-200",
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            <span
              aria-hidden="true"
              className={classNames(
                item.enabled ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              )}
            />
          </Switch>
        </div>
      </div>
    </div>
  )
}
