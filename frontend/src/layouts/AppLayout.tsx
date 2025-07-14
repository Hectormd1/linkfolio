import { useQuery } from "@tanstack/react-query"
import { Navigate } from "react-router-dom"
import { getUser } from "../api/LinkFolioApi"
import Loader from "../components/Loader"

import LinkFolio from "../components/LinkFolio"

export default function AppLayout() {
  const { data, isLoading, isError } = useQuery({
    queryFn: getUser,
    queryKey: ["user"],
    retry: 1,
    refetchOnWindowFocus: false,
  })

  if (isLoading) return <div className="bg-gray-100"><Loader /></div>
  //TODO
  // quitar pantallazo blanco en pantallas de carga
  if (isError) return <Navigate to={"/auth/login"} />

  if (data) return <LinkFolio data={data} />
}
