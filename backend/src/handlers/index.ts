import { Request, Response } from "express"
import slug from "slug"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import { validationResult } from "express-validator"

export const createAccount = async (
  req: Request,
  res: Response
) => {
  // Manejar errores
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors)
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    const error = new Error(
      `El usuario con correo '${email}' ya existe`
    )
    return res.status(409).json({ error: error.message })
  }

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
    const error = new Error('El usuario no existe')
    return res.status(404).json({ error: error.message })
  }

  // Comprobar password
  const isPassCorrect = await checkPassword(password, user.password)

  if(!isPassCorrect){
    const error = new Error('Password incorrecto')
    return res.status(401).json({ error: error.message })
  }

  res.send('Autenticado...')
}
