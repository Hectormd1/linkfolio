import { Router, Request, Response } from 'express'
import User from './models/User'
import { createAccount } from './handlers'

const router = Router()

// Autenticacion y registro
router.post('/auth/register', (req: Request, res: Response) => {
  createAccount(req, res);
})

export default router