import { Link } from "react-router-dom"

export default function HomeNavigation() {
  return (
    <>
      <Link
        className="text-white p-2 uppercase font-bold text-xs cursor-pointer"
        to="/auth/register"
      >
        Registrarme
      </Link>
      <Link
        to="/auth/login"
        className="bg-secondary text-slate-800 p-2 uppercase font-black text-xs cursor-pointer rounded-lg 
             shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl transform-gpu"
      >
        Iniciar Sesión
      </Link>
    </>
  )
}
