import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export default function AdminNavigation() {
  const queryClient = useQueryClient()

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

  return (
    <button
      className=" bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer"
      onClick={logout}
    >
      Cerrar Sesión
    </button>
  )
}
