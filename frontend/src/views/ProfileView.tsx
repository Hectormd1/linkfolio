import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import ErrorMessage from "../components/ErrorMessage"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ProfileForm, User } from "../types"
import { updateProfile, uploadImage } from "../api/DevTreeApi"

export default function ProfileView() {
  const queryClient = useQueryClient()
  const data: User = queryClient.getQueryData(["user"])!

  const [handle, setHandle] = useState(data.handle)
  const [description, setDescription] = useState(data.description)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)

  // Detecta cambios
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const imageChanged = !!selectedImageFile
    setHasChanges(
      handle !== data.handle || description !== data.description || imageChanged
    )
  }, [handle, description, selectedImageFile, data.handle, data.description])

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
    mutationFn: updateProfile,
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

  // const uploadImageMutation = useMutation({
  //   mutationFn: uploadImage,
  //   onError: (error) => {
  //     toast.error(error.message)
  //   },
  //   onSuccess: (data) => {
  //     queryClient.setQueryData(["user"], (prevData: User) => ({
  //       ...prevData,
  //       image: data,
  //     }))
  //   },
  // })

  // Cambios en tiempo real para handle
  const handleHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHandle(e.target.value)
    // No actualices el cache aquí
  }

  // Cambios en tiempo real para description
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value)
    // No actualices el cache aquí
  }

  // Cambia la imagen solo en el cache para previsualización
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        // Solo actualiza el cache para previsualización en DevTree
        queryClient.setQueryData(["user"], (prev: User) => ({
          ...prev,
          image: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Al guardar, sube la imagen y guarda la URL real
  const handleUserProfileForm = async (e: React.FormEvent) => {
    e.preventDefault()
    let imageUrl = data.image
    if (selectedImageFile) {
      imageUrl = (await uploadImage(selectedImageFile)) ?? ""
    }
    updateProfileMutation.mutate({
      ...data,
      handle,
      description,
      image: imageUrl,
    })
  }

  useEffect(() => {
    // Guardamos los datos originales al montar
    const originalData = { ...data }

    return () => {
      // Restauramos los datos originales al desmontar (cambiar de vista)
      queryClient.setQueryData(["user"], originalData)
    }
  }, []) // Solo una vez al montar/desmontar

  return (
    <form
      className="bg-white p-10 rounded-lg space-y-5"
      onSubmit={handleUserProfileForm}
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
          value={handle}
          onChange={handleHandleChange}
        />
        {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
      </div>

      <div className="grid grid-cols-1 gap-2">
        <label htmlFor="description">Descripción:</label>
        <textarea
          className="border-none bg-slate-100 rounded-lg p-2"
          placeholder="Tu Descripción"
          value={description}
          onChange={handleDescriptionChange}
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
          className="border-none bg-slate-100 rounded-lg p-2"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <input
          type="submit"
          className={`p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer ${
            hasChanges ? "bg-cyan-400" : "bg-slate-100 cursor-not-allowed"
          }`}
          value="Guardar Cambios"
          disabled={!hasChanges}
          style={{ width: "50%" }}
        />
      </div>
    </form>
  )
}
