import { Link, useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import type { RegisterForm } from "../types/index"
import ErrorMessage from "../components/ErrorMessage"
import api from "../config/axios"

export default function RegisterView() {
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()  
  const navigate = useNavigate()

  const initialValues: RegisterForm = {
    name: "",
    email: "",
    handle: location?.state?.handle || "",
    password: "",
    password_confirmation: "",
  }
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues })

  const password = watch("password")

  const handleRegister = async (formData: RegisterForm) => {
    try {
      setIsLoading(true)
      const { data } = await api.post(`/auth/register`, formData)

      const promise = () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ name: "Sonner" }), 1000)
        )
      toast.promise(promise, {
        loading: "Registrando usuario...",
        success: data
      })
      
      reset()
      navigate('/auth/login')
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <h1 className="text-4xl text-white text-center font-blod">Crear cuenta</h1>
      <form
        onSubmit={handleSubmit(handleRegister)}
        className="bg-white px-5 pt-5 pb-10 rounded-lg space-y-3 mt-10"
      >
        <div className="grid grid-cols-1 space-y-2">
          <label htmlFor="name" className="text-xl text-slate-500">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            placeholder="Tu Nombre"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("name", {
              required: "El nombre es obligatorio",
            })}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="email" className="text-xl text-slate-500">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("email", {
              required: "El email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="handle" className="text-xl text-slate-500">
            Handle
          </label>
          <input
            id="handle"
            type="text"
            placeholder="Nombre de usuario"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("handle", {
              required: "El handle es obligatorio",
            })}
          />
          {errors.handle && (
            <ErrorMessage>{errors.handle.message}</ErrorMessage>
          )}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="password" className="text-xl text-slate-500">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password de Registro"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("password", {
              required: "El password es obligatorio",
              minLength: {
                value: 8,
                message: "El password debe ser de 8 minimo caracteres",
              },
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label
            htmlFor="password_confirmation"
            className="text-xl text-slate-500"
          >
            Repetir Password
          </label>
          <input
            id="password_confirmation"
            type="password"
            placeholder="Repetir Password"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("password_confirmation", {
              required: "Repetir el password es obligatorio",
              validate: (value) =>
                value === password || "Los passwords no coinciden",
            })}
          />
          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`block mx-auto p-2 text-lg w-auto uppercase rounded-lg font-bold transition-all duration-300 ease-in-out ${
            isLoading 
              ? "bg-slate-400 cursor-not-allowed" 
              : "bg-primary text-white cursor-pointer hover:scale-105 hover:shadow-lg"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Creando...</span>
            </div>
          ) : (
            "Crear Cuenta"
          )}
        </button>
      </form>
      <nav className="mt-10">
        <Link className="text-center text-white text-base block" to="/auth/login">
          Ya tienes cuenta? Inicia sesión.
        </Link>
      </nav>
    </>
  )
}
