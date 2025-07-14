import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export default function SocialAuthView() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get("token")
    if (token) {
      localStorage.setItem("AUTH_TOKEN", token)
      navigate("/admin")
    } else {
      navigate("/auth/login")
    }
  }, [location, navigate])

  return <p className="text-center">Autenticando...</p>
}