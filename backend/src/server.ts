import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import router from './router'
import { connectDB } from './config/db'
import { corsConfig } from './config/cors'
connectDB()

const app = express()

// CORS
app.use(cors(corsConfig))

// Leer datos de formularios
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use('/', router)

export default app