import { useForm } from "react-hook-form"
import slugify from "react-slugify"
import { useMutation } from "@tanstack/react-query"
import ErrorMessage from "./ErrorMessage"
import { searchByHandle } from "../api/LinkFolioApi"
import { Link } from "react-router-dom"

export default function SearchForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      handle: "",
    },
  })
  const mutation = useMutation({
    mutationFn: searchByHandle,
  })

  const handle = watch("handle")
  const handleSearch = () => {
    const slug = slugify(handle)
    mutation.mutate(slug)
  }

  return (
    <>
      <h1 className="text-6xl font-black">
        Todas tus <span className="text-primary">Redes Sociales </span>
        en un enlace
      </h1>
      <p className="text-slate-800 text-xl">
        Únete a mas de 200 mil developers compatiendo sus redes sociales,
        comparte tu perfil de TikTok, Facebook, Instagram, YouTube, Github y más
      </p>

      <form onSubmit={handleSubmit(handleSearch)} className="space-y-5">
        <div className="relative flex items-center  bg-white  px-2">
          <label htmlFor="handle">linkfolio.netlify.app/</label>
          <input
            type="text"
            id="handle"
            className="border-none bg-transparent p-2 focus:ring-0 flex-1"
            placeholder="Elige tu nombre de usuario"
            {...register("handle", {
              required: "Un Nombre de Usuario es obligatorio",
            })}
          />
        </div>
        {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}

        <div className="mt-10">
          {mutation.isPending && <p className="text-center">Cargando...</p>}
          {mutation.error && (
            <p className="text-center text-red-600 font-black">
              {mutation.error.message}
            </p>
          )}
          {mutation.data && (
            <p className="text-center text-primary font-black">
              {mutation.data} ir a{" "}
              <Link
                className="text-secondary"
                state={{ handle: slugify(handle) }}
                to={"/auth/register"}
              >
                Registro
              </Link>
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <input
            type="submit"
            disabled={!handle.trim()}
            className={`p-3 text-lg uppercase rounded-lg font-bold transition-all duration-300 ease-in-out transform-gpu
      ${
        handle.trim()
          ? "bg-primary text-white cursor-pointer hover:scale-105 hover:shadow-xl shadow-lg"
          : "bg-slate-200 text-slate-400 cursor-not-allowed"
      }
      min-w-[220px] w-1/2 max-w-sm
    `}
            value="Obtener mi LinkFolio"
          />
        </div>
      </form>
    </>
  )
}
