import { Request, Response } from "express"
import slug from "slug"
import formidable from "formidable"
import { v4 as uuid } from "uuid"
import User from "../models/User"
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
    if (handleExists && handleExists.email !== req.user.email) {
      const error = new Error(
        `El usuario con nombre '${handle}' no está disponible`
      )
      return res.status(409).json({ error: error.message })
    }

    // Actualizar usuario
    req.user.description = description
    req.user.handle = handle
    req.user.links = links

    await req.user.save()
    res.send("Perfil actualizado correctamente")
  } catch (e) {
    const error = new Error("Hubo un error")
    res.status(500).json({ error: error.message })
  }
}

export const uploadImage = async (req: Request, res: Response) => {
  const form = formidable({ multiples: false })
  form.parse(req, (error, fields, files) => {
    const file = files.file[0]
    console.log(file.filepath)

    cloudinary.uploader.upload(
      file.filepath,
      { public_id: uuid() },
      async function (error, result) {
        if (error) {
          const error = new Error("Hubo un error al subir la imagen")
          res.status(500).json({ error: error.message })
        }
        if (result) {
          req.user.image = result.secure_url
          await req.user.save()
          res.json({ image: result.secure_url })
        }
      }
    )
  })
  try {
  } catch (e) {
    const error = new Error("Hubo un error")
    res.status(500).json({ error: error.message })
  }
}

export const getUserByHandle = async (req: Request, res: Response) => {
  try {
    const { handle } = req.params
    const user = await User.findOne({ handle }).select('-_id -password -__v -email')

    if (!user) {
      const error = new Error("El usuario no existe")
      return res.status(404).json({ error: error.message })
    }

    res.json(user)
  } catch (e) {
    const error = new Error("Hubo un error")
    res.status(500).json({ error: error.message })
  }
}
