import { Router, Request, Response, NextFunction } from "express"
import { body } from "express-validator"
import { createAccount, getUser, login } from "./handlers"
import { handleInputErrors } from "./middleware/validation"
import { authenticate } from "./middleware/auth"

const router = Router()

// Autenticacion y registro
router.post(
  "/auth/register",
  body("handle").notEmpty().withMessage("El handle no puede ir vacio"),
  body("name").notEmpty().withMessage("El name no puede ir vacio"),
  body("email").isEmail().withMessage("E-mail no válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage(
      "El password es muy corto, debe contener al menos 8 caracteres"
    ),
  (req: Request, res: Response, next: NextFunction) => {
    handleInputErrors(req, res, next)
  },
  (req: Request, res: Response) => {
    createAccount(req, res)
  }
)

router.post(
  "/auth/login",
  body("email").isEmail().withMessage("E-mail no válido"),
  body("password").notEmpty().withMessage("El password es obligatorio"),
  (req: Request, res: Response, next: NextFunction) => {
    handleInputErrors(req, res, next)
  },
  (req: Request, res: Response) => {
    login(req, res)
  }
)

router.get(
  "/user", (req: Request, res: Response, next: NextFunction) => {authenticate(req, res, next)} ,
  (req: Request, res: Response) => {getUser(req, res)} 
)

export default router
