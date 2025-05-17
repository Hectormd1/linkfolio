import { Router, Request, Response } from "express"
import { body } from "express-validator"
import { createAccount } from "./handlers"

const router = Router()

// Autenticacion y registro
router.post(
  "/auth/register",
  body("handle")
    .notEmpty()
    .withMessage("El handle no puede ir vacio"),
  body("name")
    .notEmpty()
    .withMessage("El name no puede ir vacio"),
  body("email").isEmail().withMessage("E-mail no válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password no puede ir vacio"),
  (req: Request, res: Response) => {
    createAccount(req, res)
  }
)

export default router
