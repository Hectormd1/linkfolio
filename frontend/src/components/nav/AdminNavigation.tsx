import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useState } from "react"
import BugModal from "../BugModal"

export default function AdminNavigation() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  type User = { handle?: string; email?: string }
  const user = queryClient.getQueryData<User>(["user"])

  const logout = () => {
    localStorage.removeItem("AUTH_TOKEN")
    queryClient.invalidateQueries({ queryKey: ["user"] })
    const promise = () =>
      new Promise((resolve) =>
        setTimeout(() => resolve({ name: "Sonner" }), 2500)
      )

    toast.promise(promise, {
      loading: "Cerrando sesion...",
      error: "Error",
    })
  }

  const handleContact = () => {
    setShowModal(true)
  }

  const handleSend = async (message: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/bug/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          user: user?.handle || user?.email || "anónimo",
        }),
      })
      if (res.ok) {
        toast.success("¡Gracias por tu reporte! Revisaremos el bug.")
        setShowModal(false)
      } else {
        toast.error("No se pudo enviar el reporte.")
      }
    } catch {
      toast.error("No se pudo enviar el reporte.")
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        className="bg-transparent text-white text-xs font-bold capitalize cursor-pointer border-none p-0 m-0 hover:underline"
        style={{ boxShadow: "none" }}
        onClick={handleContact}
      >
        Contacto
      </button>
      <button
        className="bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer"
        onClick={logout}
      >
        Cerrar Sesión
      </button>
      <BugModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSend={handleSend}
      />
    </div>
  )
}
