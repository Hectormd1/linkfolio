import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import type { LoginForm } from "../types"
import ErrorMessage from "../components/ErrorMessage"
import { toast } from "sonner"
import { login } from "../api/LinkFolioApi"

export default function LoginView() {
  const baseURL = import.meta.env.VITE_API_URL
  const initialValues: LoginForm = {
    email: "",
    password: "",
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("AUTH_TOKEN", data)
      window.location.href = "/admin"
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const handleLogin = (formData: LoginForm) => {
    mutation.mutate(formData)
  }

  return (
    <>
      <h1 className="text-4xl text-white font-blod text-center">Iniciar sesion</h1>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="bg-white px-5 pb-10 pt-5 rounded-lg space-y-3 mt-10"
        noValidate
      >
        <div className="grid grid-cols-1 space-y-2">
          <label htmlFor="email" className="text-xl text-slate-500">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>
        <div className="grid grid-cols-1 space-y-2">
          <label htmlFor="password" className="text-xl text-slate-500">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password de Registro"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className={`block mx-auto p-2 text-base w-auto uppercase rounded-lg font-bold transition-all duration-300 ease-in-out ${
            mutation.isPending
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-primary text-white cursor-pointer hover:scale-105 hover:shadow-lg"
          }`}
        >
          {mutation.isPending ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Iniciando...</span>
            </div>
          ) : (
            "Iniciar Sesión"
          )}
        </button>

        <div className="flex flex-row gap-2 mt-4 justify-center">
          <a
            href={`${baseURL}/auth/google`}
            className="bg-white text-black font-bold border border-gray-300 rounded-lg p-2 flex items-center justify-center gap-2 hover:bg-gray-100"
          >
            <img src="/social/icon_google.svg" alt="Google" className="w-6 h-6" />
            Google
          </a>
          <a
            href={`${baseURL}/auth/github`}
            className="bg-white text-black font-bold border border-gray-300 rounded-lg p-2 flex items-center justify-center gap-2 hover:bg-gray-100"
          >
            <img src="/social/icon_github.svg" alt="GitHub" className="w-6 h-6" />
            GitHub
          </a>
        </div>
      </form>
      <nav className="mt-10">
        <Link
          className="text-center text-white text-lg block"
          to="/auth/register"
        >
          ¿No tienes cuenta? Crea una aquí.
        </Link>
      </nav>
    </>
  )
}
