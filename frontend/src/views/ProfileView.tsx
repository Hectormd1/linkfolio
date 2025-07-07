import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import ErrorMessage from "../components/ErrorMessage"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ProfileForm, User } from "../types"
import { updateProfile, uploadImage } from "../api/LinkFolioApi"

export default function ProfileView() {
  const queryClient = useQueryClient()
  const data: User = queryClient.getQueryData(["user"])!

  const [handle, setHandle] = useState(data.handle)
  const [description, setDescription] = useState(data.description)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)

  // Detecta cambios
  const [hasChanges, setHasChanges] = useState(false)
  const [hasSaved, setHasSaved] = useState(false)

  useEffect(() => {
    const imageChanged = !!selectedImageFile
    setHasChanges(
      handle !== data.handle || description !== data.description || imageChanged
    )
  }, [handle, description, selectedImageFile, data.handle, data.description])

  const {
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
      setHasSaved(true) // Marcar como guardado
      const promise = () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ name: "Sonner" }), 1000)
        )
      toast.promise(promise, {
        loading: "Actualizando usuario...",
        success: data,
      })
      setHasChanges(false)

      // En caso de success actualizamos el componente de LinkFolio
      // el apartado de Visitia mi Perfil: /"" invalidando la query de ['user']
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })

  // Cambios en tiempo real para handle
  const handleHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHandle(e.target.value)
  }

  // Cambios en tiempo real para description
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value)
  }

  // Cambia la imagen solo en el cache para previsualización
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        // Solo actualiza el cache para previsualización en LinkFolio
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
    const originalData = { ...data }
    return () => {
      // Solo restaurar si NO se ha guardado
      if (!hasSaved) {
        queryClient.setQueryData(["user"], originalData)
      }
    }
  }, [hasSaved]) // Solo una vez al montar/desmontar

  return (
    <div className="max-w-md mx-auto">
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
          <label htmlFor="image">Imagen:</label>
          <div className="bg-slate-100 rounded-lg p-2 flex items-center gap-3">
            <label
              htmlFor="image"
              className="bg-primary text-white text-xs px-2 py-2 rounded-lg font-bold cursor-pointer hover:scale-105 hover:shadow-lg transition w-auto"
            >
              Seleccionar imagen
            </label>
            <span className="text-slate-500 truncate text-xs">
              {selectedImageFile ? selectedImageFile.name : "Ninguna imagen seleccionado"}
            </span>
            <input
              id="image"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div>
          <input
            type="submit"
            className={`block mx-auto p-2 text-lg uppercase rounded-lg font-bold transition-all duration-300 ease-in-out ${
              hasChanges
                ? "bg-primary text-white cursor-pointer hover:scale-105 hover:shadow-lg"
                : "bg-slate-100 text-slate-600 cursor-not-allowed"
            }`}
            value="Guardar Cambios"
            disabled={!hasChanges}
          />
        </div>
      </form>
    </div>
  )
}
