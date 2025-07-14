import { Router, Request, Response, NextFunction } from "express"
import { body } from "express-validator"
import {
  createAccount,
  getUser,
  getUserByHandle,
  login,
  searchByHandle,
  updateProfile,
  uploadImage,
  getProfile,
  deleteAccount,
} from "./handlers"
import { handleInputErrors } from "./middleware/validation"
import { authenticate } from "./middleware/auth"
import { createBugReport } from "./handlers/bugReport"
import passport from "./config/passport"
import { generateJWT } from "./utils/jwt"
import { changePassword, changeEmail, changeName } from "./handlers"

const router = Router()

// Ping endpoint
router.get("/ping", (req: Request, res: Response) => {
  res.send("pong")
})

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
  "/user",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next)
  },
  (req: Request, res: Response) => {
    getUser(req, res)
  }
)

router.patch(
  "/user",
  body("handle").notEmpty().withMessage("El handle no puede ir vacio"),
  (req: Request, res: Response, next: NextFunction) => {
    handleInputErrors(req, res, next)
  },
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next)
  },
  (req: Request, res: Response) => {
    updateProfile(req, res)
  }
)

router.post(
  "/user/image",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next)
  },
  (req: Request, res: Response) => {
    uploadImage(req, res)
  }
)

router.get(
  "/:handle",
  (req: Request, res: Response) => {
    getUserByHandle(req, res)
  }
)

router.post(
  "/search",
  body("handle").notEmpty().withMessage("El handle no puede ir vacio"),
  (req: Request, res: Response, next: NextFunction) => {
    handleInputErrors(req, res, next)
  },
  (req: Request, res: Response) => {
    searchByHandle(req, res)
  }
)

router.post("/bug/report", createBugReport)

// Google OAuth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
)
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    // Genera tu JWT y redirige al frontend con el token
    const token = generateJWT({ id: req.user._id })
    res.redirect(`${process.env.FRONTEND_URL}/auth/social?token=${token}`)
  }
)

// GitHub OAuth
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
)
router.get(
  "/auth/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const token = generateJWT({ id: req.user._id })
    res.redirect(`${process.env.FRONTEND_URL}/auth/social?token=${token}`)
  }
)

router.post(
  "/user/change-password",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next)
  },
  (req: Request, res: Response) => {
    changePassword(req, res)
  }
)

router.post("/user/change-email",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next)
  }, (req: Request, res: Response) => {
    changeEmail(req, res)
  })

router.post("/user/change-name",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next)
  }, (req: Request, res: Response) => {
    changeName(req, res)
  })

router.get("/user/profile", 
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next)
  }, (req: Request, res: Response) => {
    getProfile(req, res)
  })


router.post("/user/delete-account",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next)
  }, (req: Request, res: Response) => {
    deleteAccount(req, res)
  })
export default router
