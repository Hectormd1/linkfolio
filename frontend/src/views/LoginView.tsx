import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import type { LoginForm } from "../types"
import ErrorMessage from "../components/ErrorMessage"
import { isAxiosError } from "axios"
import { toast } from "sonner"

import api from "../config/axios"

export default function LoginView() {
  const initialValues: LoginForm = {
    email: "",
    password: "",
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues })

  const handleLogin = async (formData: LoginForm) => {
    try {
      const { data } = await api.post(`/auth/login`, formData)
      localStorage.setItem("AUTH_TOKEN", data)
      window.location.href = "/admin"
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.error)
      }
    }
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

        <input
          type="submit"
          className={`block mx-auto p-2 text-base w-auto uppercase rounded-lg font-bold transition-all duration-300 ease-in-out bg-primary text-white cursor-pointer hover:scale-105 hover:shadow-lg`}
          value="Iniciar Sesión"
        />
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
