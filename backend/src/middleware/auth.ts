import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User, { IUSer } from "../models/User"

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization

  if (!bearer) {
    const error = new Error("No autorizado")
    return res.status(401).json({ error: error.message })
  }
  
  // Creamos un array que se separece mediante el caracter " " y metemos cada division
  // en 2 variables, la primera ni la declaramos ya que no se necesita, y la segunda 
  // la duardamos en la variable "token"
  const [, token] = bearer.split(" ")

  if (!token) {
    const error = new Error("No autorizado")
    return res.status(401).json({ error: error.message })
  }

  try {
    const result = jwt.verify(token, process.env.JWT_SECRET)
    if (typeof result === "object" && result.id) {
      const user = await User.findById(result.id).select("-password")
      if (!user) {
        const error = new Error("El usuario no existe")
        return res.status(404).json({ error: error.message })
      }
      req.user = user // Si necesitas el tipo IUSer, usa: req.user = user as IUSer
      next()
    }
  } catch (error) {
    res.status(500).json({ error: "Token No Válido" })
  }
}
