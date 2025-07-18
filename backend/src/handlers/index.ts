import { Request, Response } from "express"
import slug from "slug"
import formidable from "formidable"
import { v4 as uuid } from "uuid"
import User, { IUSer } from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import { validationResult } from "express-validator"
import { generateJWT } from "../utils/jwt"
import cloudinary from "../config/cloudinary"

export const createAccount = async (req: Request, res: Response) => {
  // Manejar errores
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors)
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    const error = new Error(`El usuario con correo '${email}' ya existe`)
    return res.status(409).json({ error: error.message })
  }

  /** Aquí, slug(req.body.handle, "") está convirtiendo el valor ingresado
   * por el usuario (por ejemplo "Juan Pérez!") en un slug.
   * El segundo argumento ("") parece indicar que no se usará ningún separador
   * (por defecto suele ser "-"), por lo tanto:
   * "Juan Pérez!" → "juanperez" */
  const handle = slug(req.body.handle, "")
  const handleExists = await User.findOne({ handle })
  if (handleExists) {
    const error = new Error(
      `El usuario con nombre '${handle}' no está disponible`
    )
    return res.status(409).json({ error: error.message })
  }

  const user = new User(req.body)
  user.password = await hashPassword(password)
  user.handle = handle

  await user.save()

  res.status(201).send("Registro creado correctamente")
}

export const login = async (req: Request, res: Response) => {
  // Manejar errores

  const { email, password } = req.body

  // Revisar si el usuario esta registrado
  const user = await User.findOne({ email })
  if (!user) {
    const error = new Error("El usuario no existe")
    return res.status(404).json({ error: error.message })
  }

  // Comprobar password
  const isPassCorrect = await checkPassword(password, user.password)

  if (!isPassCorrect) {
    const error = new Error("Password incorrecto")
    return res.status(401).json({ error: error.message })
  }

  const token = generateJWT({ id: user._id })

  res.send(token)
}

export const getUser = async (req: Request, res: Response) => {
  res.json(req.user)
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { description, links } = req.body
    const handle = slug(req.body.handle, "")
    const handleExists = await User.findOne({ handle })
    const user = req.user as IUSer
    if (handleExists && handleExists.email !== user.email) {
      const error = new Error(
        `El usuario con nombre '${handle}' no está disponible`
      )
      return res.status(409).json({ error: error.message })
    }

    // Actualizar usuario
    user.description = description
    user.handle = handle
    user.links = links

    await user.save()
    res.send("Perfil actualizado correctamente")
  } catch (e) {
    const error = new Error("Ha habido un error")
    res.status(500).json({ error: error.message })
  }
}

export const uploadImage = async (req: Request, res: Response) => {
  const form = formidable({ multiples: false })
  form.parse(req, (error, fields, files) => {
    const file = files.file[0]

    cloudinary.uploader.upload(
      file.filepath,
      { public_id: uuid() },
      async function (error, result) {
        if (error) {
          const error = new Error("Ha habido un error al subir la imagen")
          res.status(500).json({ error: error.message })
        }
        if (result) {
          const user = req.user as IUSer
          user.image = result.secure_url
          await user.save()
          res.json({ image: result.secure_url })
        }
      }
    )
  })
  try {
  } catch (e) {
    const error = new Error("Ha habido un error")
    res.status(500).json({ error: error.message })
  }
}

export const getUserByHandle = async (req: Request, res: Response) => {
  try {
    const { handle } = req.params
    const user = await User.findOne({ handle }).select(
      "-_id -password -__v"
    )

    if (!user) {
      const error = new Error("El usuario no existe")
      return res.status(404).json({ error: error.message })
    }

    res.json(user)
  } catch (e) {
    const error = new Error("Ha habido un error")
    res.status(500).json({ error: error.message })
  }
}

export const searchByHandle = async (req: Request, res: Response) => {
  try {
    const { handle } = req.body
    const userExists = await User.findOne({ handle })

    if (userExists) {
      const error = new Error(`El usuario '${handle}' ya existe`)
      return res.status(409).json({ error: error.message })
    }

    res.send(`El usuario '${handle}' está disponible`)
  } catch (e) {
    const error = new Error("Ha habido un error")
    res.status(500).json({ error: error.message })
  }
}

export const changeName = async (req: Request, res: Response) => {
  const { name } = req.body
  if (!name || name.length < 2 || name.length > 32) {
    return res.status(400).json({ error: "El nombre debe tener entre 2 y 32 caracteres" })
  }
  const user = await User.findById((req.user as IUSer)._id)
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" })
  }
  user.name = name
  await user.save()
  res.json({ message: "Nombre actualizado correctamente" })
}

export const changeEmail = async (req: Request, res: Response) => {
  const { email } = req.body
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Email no válido" })
  }
  // Verifica si el email ya está en uso
  const exists = await User.findOne({ email })
  if (exists) {
    return res.status(400).json({ error: "El email ya está en uso" })
  }
  const user = await User.findById((req.user as IUSer)._id)
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" })
  }
  user.email = email
  await user.save()
  res.json({ message: "Email actualizado correctamente" })
}

export const changePassword = async (req: Request, res: Response) => {
  const { password, password_confirmation } = req.body
  if (!password || password.length < 8) {
    return res.status(400).json({ error: "El password debe tener al menos 8 caracteres" })
  }
  if (password !== password_confirmation) {
    return res.status(400).json({ error: "Los passwords no coinciden" })
  }
  const user = await User.findById((req.user as IUSer)._id)
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" })
  }
  user.password = await hashPassword(password)
  await user.save()
  res.json({ message: "Contraseña actualizada correctamente" })
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    // Usa el handle del usuario autenticado
    const user = await User.findOne({ handle: (req.user as IUSer).handle }).select("name email handle")
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }
    res.json({ name: user.name, email: user.email, handle: user.handle })
  } catch (e) {
    res.status(500).json({ error: "Ha habido un error" })
  }
}

export const deleteAccount = async (req: Request, res: Response) => {
  const { password } = req.body
  const user = await User.findById((req.user as IUSer)._id)
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" })
  const valid = await checkPassword(password, user.password)
  if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" })
  await user.deleteOne()
  res.json({ message: "Cuenta eliminada correctamente" })
}