import { useForm } from "react-hook-form"
import ErrorMessage from "../components/ErrorMessage"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ProfileForm, User } from "../types"
import { updateUser, uploadImage } from "../api/DevTreeApi"

export default function ProfileView() {
  const queryClient = useQueryClient()
  const data: User = queryClient.getQueryData(["user"])!

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: {
      handle: data.handle,
      description: data.description,
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: updateUser,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      const promise = () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ name: "Sonner" }), 1000)
        )
      toast.promise(promise, {
        loading: "Actualizando usuario...",
        success: data,
      })

      // En caso de success actualizamos el componente de Devtree
      // el apartado de Visitia mi Perfil: /"" invalidando la query de ['user']
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onError: (error) => {
      console.log(error);
      
      // toast.error(error.message)
    },
    onSuccess: (data) => {
      console.log(data);
      
      // const promise = () =>
      //   new Promise((resolve) =>
      //     setTimeout(() => resolve({ name: "Sonner" }), 1000)
      //   )
      // toast.promise(promise, {
      //   loading: "Actualizando usuario...",
      //   success: data,
      // })

      // En caso de success actualizamos el componente de Devtree
      // el apartado de Visitia mi Perfil: /"" invalidando la query de ['user']
      
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log(e.target.files[0])
      uploadImageMutation.mutate(e.target.files[0])
    }
  }
  const handleUserProfileForm = (formData: ProfileForm) => {
    updateProfileMutation.mutate(formData)
  }

  return (
    <form
      className="bg-white p-10 rounded-lg space-y-5"
      onSubmit={handleSubmit(handleUserProfileForm)}
    >
      <legend className="text-2xl text-slate-800 text-center">
        Editar Información
      </legend>
      <div className="grid grid-cols-1 gap-2">
        <label htmlFor="handle">Handle:</label>
        <input
          type="text"
          className="border-none bg-slate-100 rounded-lg p-2"
          placeholder="handle o Nombre de Usuario"
          {...register("handle", {
            required: "El nombre de usuario es obligatorio",
          })}
        />
        {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
      </div>

      <div className="grid grid-cols-1 gap-2">
        <label htmlFor="description">Descripción:</label>
        <textarea
          className="border-none bg-slate-100 rounded-lg p-2"
          placeholder="Tu Descripción"
          {...register("description", {
            required: "La Descripción es obligatoria",
          })}
        />
        {errors.description && (
          <ErrorMessage>{errors.description.message}</ErrorMessage>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        <label htmlFor="handle">Imagen:</label>
        <input
          id="image"
          type="file"
          name="handle"
          className="border-none bg-slate-100 rounded-lg p-2"
          accept="image/*"
          onChange={handleChange}
        />
      </div>

      <input
        type="submit"
        className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
        value="Guardar Cambios"
      />
    </form>
  )
}
