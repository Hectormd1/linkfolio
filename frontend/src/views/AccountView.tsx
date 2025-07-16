import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import ErrorMessage from "../components/ErrorMessage"
import { toast } from "sonner"
import api from "../config/axios"
import { useQueryClient } from "@tanstack/react-query"

export default function AccountView() {
  const queryClient = useQueryClient()
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordValue, setPasswordValue] = useState("")
  const [passwordConfirmationValue, setPasswordConfirmationValue] = useState("")
  const [isChangingEmail, setIsChangingEmail] = useState(false)
  const [emailValue, setEmailValue] = useState("")
  const [isChangingName, setIsChangingName] = useState(false)
  const [nameValue, setNameValue] = useState("")
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null)
  const [showDelete, setShowDelete] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    reset: resetEmail,
    formState: { errors: errorsEmail },
  } = useForm()
  const {
    register: registerName,
    handleSubmit: handleSubmitName,
    reset: resetName,
    formState: { errors: errorsName },
  } = useForm()

  useEffect(() => {
    api.get("/user/profile")
      .then(res => {
        setUserData({ name: res.data.name, email: res.data.email })
      })
      .catch(() => {
        setUserData({ name: "No disponible", email: "No disponible" })
      })
  }, [])
  
  const handleChangeEmail = async (data: any) => {
    setIsChangingEmail(true)
    try {
      await api.post("/user/change/email", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}` }
      })
      toast.success("Email modificado correctamente", { position: "top-right" })
      setEmailValue("")
      resetEmail()
      setUserData(prev => prev ? { ...prev, email: data.email } : prev)
      // Actualiza la cache de usuario para LinkFolio
      queryClient.setQueryData(["user"], (prev: any) => ({
        ...prev,
        email: data.email,
      }))
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error al cambiar email")
    } finally {
      setIsChangingEmail(false)
    }
  }

  const handleChangePassword = async (data: any) => {
    setIsChangingPassword(true)
    try {
      await api.post("/user/change/password", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}` }
      })
      toast.success("Contraseña modificada correctamente", { position: "top-right" })
      setPasswordValue("")
      setPasswordConfirmationValue("")
      reset()
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error al cambiar contraseña")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleChangeName = async (data: any) => {
    setIsChangingName(true)
    try {
      await api.post("/user/change/name", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}` }
      })
      toast.success("Nombre modificado correctamente", { position: "top-right" })
      setNameValue("")
      resetName()
      setUserData(prev => prev ? { ...prev, name: data.name } : prev)
      // Actualiza la cache de usuario para LinkFolio
      queryClient.setQueryData(["user"], (prev: any) => ({
        ...prev,
        name: data.name,
      }))
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error al cambiar nombre")
    } finally {
      setIsChangingName(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await api.post("/user/delete/account", { password: deletePassword }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}` }
      })
      toast.success("Cuenta eliminada correctamente", { position: "top-right" })
      // Elimina el token y redirige al login
      localStorage.removeItem("AUTH_TOKEN")
      window.location.href = "/auth/login"
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error al eliminar la cuenta")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <form className="bg-white p-10 rounded-lg space-y-8 mt-5">
        <h2 className="text-2xl text-slate-800 text-center mb-6">Modificar datos de usuario</h2>
        {/* Nombre */}
        <div>
          <label className="block mb-1 font-bold">
            Nombre:{" "}
            <span className="text-primary font-normal ml-2">
              {userData?.name || "Cargando..."}
            </span>
          </label>
          <input
            type="text"
            className="bg-slate-100 border-none p-2 rounded-lg w-full"
            {...registerName("name", {
              required: "El nombre es obligatorio",
              minLength: { value: 2, message: "Mínimo 2 caracteres" },
              maxLength: { value: 32, message: "Máximo 32 caracteres" },
            })}
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
          />
          {errorsName.name && (
            <ErrorMessage>
              {typeof errorsName.name.message === "string"
                ? errorsName.name.message
                : "Error en el nombre"}
            </ErrorMessage>
          )}
          <button
            type="button"
            className={`block mt-2 p-2 text-lg uppercase rounded-lg font-bold transition-all duration-300 ease-in-out ${
              nameValue && !isChangingName
                ? "bg-primary text-white cursor-pointer hover:scale-105 hover:shadow-lg"
                : "bg-slate-100 text-slate-600 cursor-not-allowed"
            }`}
            disabled={!nameValue || isChangingName}
            onClick={handleSubmitName(handleChangeName)}
          >
            {isChangingName ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Cambiando nombre</span>
              </div>
            ) : (
              "Modificar nombre"
            )}
          </button>
        </div>
        {/* Email */}
        <div>
          <label className="block mb-1 font-bold">
            Email:{" "}
            <span className="text-primary font-normal ml-2">
              {userData?.email || "Cargando..."}
            </span>
          </label>
          <input
            type="email"
            className="bg-slate-100 border-none p-2 rounded-lg w-full"
            {...registerEmail("email", {
              required: "El email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
          />
          {errorsEmail.email && (
            <ErrorMessage>
              {typeof errorsEmail.email.message === "string"
                ? errorsEmail.email.message
                : "Error en el email"}
            </ErrorMessage>
          )}
          <button
            type="button"
            className={`block mt-2 p-2 text-lg uppercase rounded-lg font-bold transition-all duration-300 ease-in-out ${
              emailValue && !isChangingEmail
                ? "bg-primary text-white cursor-pointer hover:scale-105 hover:shadow-lg"
                : "bg-slate-100 text-slate-600 cursor-not-allowed"
            }`}
            disabled={!emailValue || isChangingEmail}
            onClick={handleSubmitEmail(handleChangeEmail)}
          >
            {isChangingEmail ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Cambiando email</span>
              </div>
            ) : (
              "Modificar email"
            )}
          </button>
        </div>
        {/* Contraseña */}
        <div>
          <label className="block mb-1 font-bold">Nueva contraseña:</label>
          <input
            type="password"
            className="bg-slate-100 border-none p-2 rounded-lg w-full"
            {...register("password", {
              required: "El password es obligatorio",
              minLength: { value: 8, message: "Mínimo 8 caracteres" },
            })}
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
          />
          {errors.password && (
            <ErrorMessage>
              {typeof errors.password.message === "string"
                ? errors.password.message
                : "Error en el password"}
            </ErrorMessage>
          )}
          <label className="block mb-1 font-bold mt-4">Repetir contraseña:</label>
          <input
            type="password"
            className="bg-slate-100 border-none p-2 rounded-lg w-full"
            {...register("password_confirmation", {
              required: "Repetir el password es obligatorio",
            })}
            value={passwordConfirmationValue}
            onChange={(e) => setPasswordConfirmationValue(e.target.value)}
          />
          {errors.password_confirmation && (
            <ErrorMessage>
              {typeof errors.password_confirmation.message === "string"
                ? errors.password_confirmation.message
                : "Error en la confirmacion del password"}
            </ErrorMessage>
          )}
          <button
            type="button"
            className={`block mt-2 p-2 text-lg uppercase rounded-lg font-bold transition-all duration-300 ease-in-out ${
              passwordValue && passwordConfirmationValue && !isChangingPassword
                ? "bg-primary text-white cursor-pointer hover:scale-105 hover:shadow-lg"
                : "bg-slate-100 text-slate-600 cursor-not-allowed"
            }`}
            disabled={
              !(passwordValue && passwordConfirmationValue) || isChangingPassword
            }
            onClick={handleSubmit(handleChangePassword)}
          >
            {isChangingPassword ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Cambiando contraseña</span>
              </div>
            ) : (
              "Modificar contraseña"
            )}
          </button>
        </div>
        {/* Eliminar cuenta */}
        <div className="mt-8">
          <button
            type="button"
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
            onClick={() => setShowDelete(!showDelete)}
          >
            Eliminar cuenta
          </button>
          {showDelete && (
            <div className="mt-4 bg-red-50 p-4 rounded-lg">
              <p className="mb-2 text-red-700 font-bold">Confirma tu contraseña para eliminar tu cuenta:</p>
              <input
                type="password"
                className="bg-slate-100 border-none p-2 rounded-lg w-full mb-2"
                placeholder="Contraseña"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
              />
              <button
                type="button"
                className={`bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition ${
                  !deletePassword || isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!deletePassword || isDeleting}
                onClick={handleDeleteAccount}
              >
                {isDeleting ? "Eliminando..." : "Confirmar eliminación"}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
