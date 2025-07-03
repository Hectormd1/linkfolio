import { useState } from "react"

type BugModalProps = {
  show: boolean
  onClose: () => void
  onSend: (message: string) => Promise<void>
}

export default function BugModal({ show, onClose, onSend }: BugModalProps) {
  const [message, setMessage] = useState("")

  const handleSend = async () => {
    await onSend(message)
    setMessage("")
  }

  if (!show) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={() => {
        onClose()
        setMessage("")
      }}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-2 text-slate-800">
          Contacta con nosotros
        </h2>
        <textarea
          className="w-full border rounded-lg p-2 mb-4"
          rows={4}
          placeholder="Escribe tu mensaje aquí..."
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-1 rounded bg-slate-200 text-slate-700 font-bold"
            onClick={() => {
              onClose()
              setMessage("")
            }}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-1 rounded bg-cyan-400 text-slate-800 font-bold cursor-pointer"
            onClick={handleSend}
            disabled={!message.trim()}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}