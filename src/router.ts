import {request, Router} from 'express'
import User from './models/User'
import { createAccount } from './handlers'

const router = Router()

// Autenticacion y registro
router.post('/auth/register', createAccount)

export default router