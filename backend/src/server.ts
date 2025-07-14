import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import router from './router'
import { connectDB } from './config/db'
import { corsConfig } from './config/cors'
import passport from "./config/passport"

connectDB()

const app = express()

app.use(passport.initialize())
console.log("Arrancando servidor LinkFolio", passport)
// CORS
app.use(cors(corsConfig))

// Leer datos de formularios
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use('/', router)

export default app