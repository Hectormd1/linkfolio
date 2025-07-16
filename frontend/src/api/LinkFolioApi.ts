import { isAxiosError } from "axios"
import api from "../config/axios"
import type { User, UserHandle } from "../types"

export async function getUser() {
  try {
    const { data } = await api<User>("/user")
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

export async function updateProfile(formData: User) {
  try {
    const { data } = await api.patch<string>("/user", formData)
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

export async function login(formData: { email: string; password: string }) {
  try {
    const { data } = await api.post<string>("/auth/login", formData)
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw new Error("Error desconocido al iniciar sesión")
  }
}

export async function register(formData: { name: string; handle: string; email: string; password: string }) {
  try {
    const { data } = await api.post<string>("/auth/register", formData)
    console.log(data);
    
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw new Error("Error desconocido al iniciar sesión")
  }
}

export async function uploadImage(file: File) {
  let formData = new FormData()
  formData.append("file", file)

  try {
    const { data: { image } }: { data: { image: string } } = await api.post("/user/image", formData)
    return image
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

export async function getUserByHandle(handle: string) {
  try {
    const { data } = await api<UserHandle>(`/${handle}`)
    console.log(data);
    
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

export async function searchByHandle(handle: string) {
  try {
    const { data } = await api.post<string>(`/search`, {handle})
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

export async function changeEmail(data: { email: string }) {
  try {
    const response = await api.patch<string>("/user/change/email", data)
    return response.data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw new Error("Error desconocido al cambiar email")
  }
}

export async function changePassword(data: { password: string; password_confirmation: string }) {
  try {
    const res = await api.post("/user/change/password", data)
    return res.data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw new Error("Error desconocido al cambiar password")
  }
}

export async function changeName(data: { name: string }) {
  try {
    const res = await api.post("/user/change/name", data)
    return res.data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw new Error("Error desconocido al cambiar name")
  }
}

export async function deleteAccount(data: { password: string }) {
  try {
    const res = await api.post("/user/delete/account", data)
    return res.data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw new Error("Error desconocido al eliminar cuenta")
  }
}