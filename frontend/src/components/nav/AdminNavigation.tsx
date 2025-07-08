import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import BugModal from "../BugModal"
import { useLocation, useNavigate } from "react-router-dom"

export default function AdminNavigation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  type User = { handle?: string; email?: string }
  const user = queryClient.getQueryData<User>(["user"])
  const location = useLocation()

  const logOut = async () => {
    setIsLoggingOut(true)
    // Simula petición logout real
    await new Promise((resolve) => setTimeout(resolve, 1500))
    localStorage.removeItem("AUTH_TOKEN")
    queryClient.invalidateQueries({ queryKey: ["user"] })
    queryClient.resetQueries({ queryKey: ["user"] })
    setIsLoggingOut(false)
    navigate("/", { state: { loggedOut: true } })
  }

  const logIn = async () => {
    navigate("/admin")
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
        // Puedes dejar este toast, ya que es para el bug report, no para logout
        // toast.success("¡Gracias por tu reporte! Revisaremos el bug.")
        setShowModal(false)
      } else {
        // toast.error("No se pudo enviar el reporte.")
      }
    } catch {
      // toast.error("No se pudo enviar el reporte.")
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        className="bg-transparent text-white text-xs font-bold uppercase cursor-pointer border-none p-0 m-0 hover:underline"
        style={{ boxShadow: "none" }}
        onClick={handleContact}
      >
        Contacto
      </button>
      {location.pathname === "/" ? (
        user ? (
          <button
            className="bg-primary p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer 
             shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl transform-gpu"
            onClick={logIn}
          >
            Ir a mi perfil
          </button>
        ) : (
          ""
        )
      ) : (
        ""
      )}

      <button
        className={`bg-secondary p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer 
             shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl transform-gpu flex items-center justify-center min-w-[120px]`}
        onClick={logOut}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Cerrando...</span>
          </div>
        ) : (
          "Cerrar Sesión"
        )}
      </button>
      <BugModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSend={handleSend}
      />
    </div>
  )
}
