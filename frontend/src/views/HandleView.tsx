import { Navigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getUserByHandle } from "../api/LinkFolioApi"
import HandleData from "../components/HandleData"
import Loader from "../components/Loader"
import { APP_PATHS } from "../utils/paths"


export default function HandleView() {
  const params = useParams()
  const handle = params.handle!
  const { data, error, isLoading } = useQuery({
    queryFn: () => getUserByHandle(handle),
    queryKey: ["handle", handle],
    retry: 1,
  })

  if (isLoading) return <Loader />
  if (error) return <Navigate to={APP_PATHS.NOT_FOUND} />
  if (data) return <HandleData data={data} />
}
