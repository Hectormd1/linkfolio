import { CorsOptions } from "cors"

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whiteList = [
      process.env.FRONTEND_URL,
      process.env.FRONTEND_URL_2
    ]

    // 🟢 Permitir peticiones sin origin (como las de Google redirect)
    if (!origin || whiteList.includes(origin)) {
      callback(null, true)
    } else {
      console.log("❌ CORS bloqueado para origen:", origin)
      callback(new Error('Error de CORS'))
    }
  },
}