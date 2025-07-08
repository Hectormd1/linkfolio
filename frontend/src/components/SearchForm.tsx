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
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-center sm:text-left">
        Todas tus <span className="text-primary">Redes Sociales </span>
        en un enlace
      </h1>
      <p className="text-slate-800 text-base sm:text-lg md:text-xl text-center sm:text-left">
        Únete a mas de 200 mil developers compatiendo sus redes sociales,
        comparte tu perfil de TikTok, Facebook, Instagram, YouTube, Github y más
      </p>

      <form onSubmit={handleSubmit(handleSearch)} className="space-y-5">
        <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
          <input
            type="text"
            id="handle"
            className="w-full border-none bg-transparent p-3 md:p-4 focus:ring-0 text-xs md:text-base placeholder-slate-400 pl-[7.4rem] md:pl-[9.6rem]"
            placeholder="Elige tu nombre de usuario"
            {...register("handle", {
              required: "Un Nombre de Usuario es obligatorio",
            })}
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600 text-xs sm:text-sm md:text-base pointer-events-none">
            linkfolio.netlify.app/
          </span>
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
              {mutation.data} haz clic en {" "}
              <Link
                className="text-secondary"
                state={{ handle: slugify(handle) }}
                to={"/auth/register"}
              >
                registro 
              </Link>
              {" "}para crear tu LinkFolio ahora!!
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <input
            type="submit"
            disabled={!handle.trim()}
            className={`p-3 text-sm sm:text-base md:text-lg uppercase rounded-lg font-bold transition-all duration-300 ease-in-out transform-gpu
      ${
        handle.trim()
          ? "bg-primary text-white cursor-pointer hover:scale-105 hover:shadow-xl shadow-lg"
          : "bg-slate-200 text-slate-400 cursor-not-allowed"
      }
      w-full sm:w-auto min-w-[220px] max-w-sm
    `}
            value="Obtener mi LinkFolio"
          />
        </div>
      </form>
    </>
  )
}
